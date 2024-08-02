const mockData = {
  users: [
    {
      id: "2baab4d6-533f-4899-9101-3cd100b3ae66",
      x: 100,
      y: 100,
      size: 20,
      type: "player",
      score: 0,
      total_score: 0,
      room_id: "mock-room-id",
      name: "grant",
      pin: "1234",
      active: true,
    },
    {
      id: "f6bf2820-08dc-4344-928a-7392a41a7fea",
      x: 200,
      y: 200,
      size: 20,
      type: "player",
      score: 0,
      total_score: 0,
      room_id: "mock-room-id",
      name: "mark",
      pin: "1234",
      active: true,
    },
  ],
  rooms: [
    {
      id: "mock-room-id",
      status: "waiting",
      start_time: null,
    },
  ],
  computer_blobs: Array.from({ length: 10 }, (_, index) => ({
    id: `computer-blob-${index}`,
    x: Math.random() * 1000,
    y: Math.random() * 500,
    size: 18,
    type: "computer",
    room_id: "mock-room-id",
    angle: Math.random() * Math.PI * 2,
  })),
};

export const supabase = {
  from: (table) => ({
    select: () => ({
      eq: (field, value) => ({
        maybeSingle: async () => {
          const data = mockData[table].find((item) => item[field] === value);
          return { data: data || null, error: data ? null : "No data found" };
        },
        single: async () => {
          const data = mockData[table].find((item) => item[field] === value);
          return { data: data || null, error: data ? null : "No data found" };
        },
        then: async (callback) => {
          const data = mockData[table].filter((item) => item[field] === value);
          callback({ data, error: null });
        },
      }),
    }),
    insert: (newData) => ({
      select: () => ({
        single: async () => {
          mockData[table].push(newData[0]);
          return { data: newData[0], error: null };
        },
      }),
    }),
    update: (updates) => ({
      eq: (field, value) => ({
        select: async () => {
          mockData[table] = mockData[table].map((item) =>
            item[field] === value ? { ...item, ...updates } : item
          );
          return { data: updates, error: null };
        },
        then: async (callback) => {
          const updatedData = mockData[table].map((item) =>
            item[field] === value ? { ...item, ...updates } : item
          );
          callback({ data: updatedData, error: null });
        },
      }),
    }),
  }),
  rpc: async (functionName, params) => {
    if (functionName === "update_and_get_positions") {
      // Update player position
      const userIndex = mockData.users.findIndex(
        (user) => user.id === params.user_id
      );
      if (userIndex !== -1) {
        mockData.users[userIndex].x = params.new_x;
        mockData.users[userIndex].y = params.new_y;
        mockData.users[userIndex].size = params.new_size;
      }

      // Update computer blobs positions
      mockData.computer_blobs.forEach((blob) => {
        const angleAdjustment = (Math.random() - 0.5) * 0.1; // Adjust angle slightly
        blob.angle += angleAdjustment;
        blob.x += Math.cos(blob.angle) * 3;
        blob.y += Math.sin(blob.angle) * 3;

        // Check boundaries
        if (blob.x <= 0 || blob.x >= 1000 || blob.y <= 0 || blob.y >= 500) {
          blob.angle = (blob.angle + Math.PI) % (2 * Math.PI); // Reverse direction
        }
      });

      const data = [
        ...mockData.users.filter(
          (user) => user.room_id === params.user_room_id
        ),
        ...mockData.computer_blobs.filter(
          (blob) => blob.room_id === params.user_room_id
        ),
      ];

      return { data, error: null };
    } else if (functionName === "verify_user_pin") {
      const { user_name, user_pin } = params;
      const user = mockData.users.find(
        (u) => u.name === user_name && u.pin === user_pin
      );
      return { data: !!user, error: null };
    }
    return {
      data: null,
      error: `Function ${functionName} not implemented in mock`,
    };
  },
};
