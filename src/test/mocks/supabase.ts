import { vi } from "vitest";

import { mockCategories, mockEmojis } from "./handlers";

// Supabase client mock
export const createMockSupabaseClient = () => {
  const mockSelect = vi.fn();
  const mockInsert = vi.fn();
  const mockUpdate = vi.fn();
  const mockDelete = vi.fn();
  const mockEq = vi.fn();
  const mockOrder = vi.fn();
  const mockLimit = vi.fn();
  const mockRange = vi.fn();
  const mockSingle = vi.fn();
  const mockMaybeSingle = vi.fn();
  const mockRpc = vi.fn();

  // Chain methods return self
  const chainMethods = {
    select: mockSelect,
    insert: mockInsert,
    update: mockUpdate,
    delete: mockDelete,
    eq: mockEq,
    neq: vi.fn(),
    gt: vi.fn(),
    gte: vi.fn(),
    lt: vi.fn(),
    lte: vi.fn(),
    like: vi.fn(),
    ilike: vi.fn(),
    is: vi.fn(),
    in: vi.fn(),
    contains: vi.fn(),
    containedBy: vi.fn(),
    or: vi.fn(),
    and: vi.fn(),
    not: vi.fn(),
    order: mockOrder,
    limit: mockLimit,
    range: mockRange,
    single: mockSingle,
    maybeSingle: mockMaybeSingle,
  };

  // All chain methods return the chain
  Object.values(chainMethods).forEach((method) => {
    method.mockReturnValue(chainMethods);
  });

  // Terminal methods return data
  mockSingle.mockResolvedValue({ data: mockEmojis[0], error: null });
  mockMaybeSingle.mockResolvedValue({ data: mockEmojis[0], error: null });

  const mockFrom = vi.fn((table: string) => {
    // Set default resolved values based on table
    if (table === "emojis") {
      mockSelect.mockReturnValue({
        ...chainMethods,
        then: (resolve: (value: { data: typeof mockEmojis; error: null }) => void) =>
          resolve({ data: mockEmojis, error: null }),
      });
    } else if (table === "categories") {
      mockSelect.mockReturnValue({
        ...chainMethods,
        then: (resolve: (value: { data: typeof mockCategories; error: null }) => void) =>
          resolve({ data: mockCategories, error: null }),
      });
    }
    return chainMethods;
  });

  mockRpc.mockResolvedValue({ data: mockEmojis, error: null });

  return {
    from: mockFrom,
    rpc: mockRpc,
    auth: {
      getUser: vi.fn().mockResolvedValue({ data: { user: null }, error: null }),
      getSession: vi.fn().mockResolvedValue({ data: { session: null }, error: null }),
      signInWithOAuth: vi.fn(),
      signOut: vi.fn(),
      onAuthStateChange: vi.fn(() => ({ data: { subscription: { unsubscribe: vi.fn() } } })),
    },
    storage: {
      from: vi.fn(() => ({
        upload: vi.fn().mockResolvedValue({ data: { path: "test-path" }, error: null }),
        getPublicUrl: vi.fn(() => ({ data: { publicUrl: "https://example.com/image.png" } })),
        download: vi.fn().mockResolvedValue({ data: new Blob(), error: null }),
        remove: vi.fn().mockResolvedValue({ data: null, error: null }),
      })),
    },
    // Expose mocks for assertions
    _mocks: {
      from: mockFrom,
      select: mockSelect,
      insert: mockInsert,
      update: mockUpdate,
      delete: mockDelete,
      eq: mockEq,
      order: mockOrder,
      limit: mockLimit,
      range: mockRange,
      single: mockSingle,
      maybeSingle: mockMaybeSingle,
      rpc: mockRpc,
    },
  };
};

// Mock the Supabase client module
export const mockSupabaseModule = () => {
  const mockClient = createMockSupabaseClient();

  vi.mock("@/lib/supabase/client", () => ({
    createClient: vi.fn(() => mockClient),
  }));

  vi.mock("@/lib/supabase/server", () => ({
    createClient: vi.fn(() => mockClient),
  }));

  return mockClient;
};
