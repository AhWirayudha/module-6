// Mock useRouter for tests that may call it
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    // add other router methods as needed
  }),
}));

import {
  buildUserQuery,
  transformUser,
  aggregateUserStats,
  getQueryParams,
} from "../src/app/api/users/route";

describe("Users API Utilities", () => {
  it("should extract query params correctly", () => {
    const req = {
      url: "http://localhost/api/users?division=Tech&page=2&limit=10",
    } as Request;
    const params = getQueryParams(req);
    expect(params.division).toBe("Tech");
    expect(params.page).toBe(2);
    expect(params.limit).toBe(10);
  });

  it("should build SQL query with division filter", () => {
    const query = buildUserQuery({ division: "Tech", page: 1, limit: 5 });
    expect(query).toContain("WHERE ud.division_name = 'Tech'");
    expect(query).toContain("LIMIT 5 OFFSET 0");
  });

  it("should build SQL query without division filter", () => {
    const query = buildUserQuery({ division: "all", page: 2, limit: 10 });
    expect(query).not.toContain("WHERE ud.division_name");
    expect(query).toContain("LIMIT 10 OFFSET 10");
  });

  it("should transform user row correctly", () => {
    const userRow = {
      id: 1,
      username: "user1",
      full_name: "User One",
      birth_date: "1990-01-01",
      bio: "Bio",
      long_bio: "Long bio",
      profile_json: {
        social_media: { instagram: "@user1" },
        preferences: {},
        skills: [],
        interests: [],
      },
      address: "Address",
      phone_number: "1234567890",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      email: "user1@example.com",
      role: "admin",
      division_name: "Tech",
      display_name: "User One (admin)",
      bio_display: "Bio",
      instagram_handle: "@user1",
      total_users: 100,
      newer_users: 10,
      log_count: 6,
      role_count: 1,
      division_count: 1,
      login_count: 2,
      update_count: 1,
      recent_logs: 1,
    };
    const user = transformUser(userRow);
    expect(user.fullName).toBe("User One");
    expect(user.isActive).toBe(true);
    expect(user.isSenior).toBe(true);
    expect(user.hasProfile).toBe(true);
    expect(user.profileCompleteness).toBeGreaterThan(0);
  });

  it("should aggregate user stats correctly", () => {
    const users = [
      {
        id: 1,
        username: "user1",
        fullName: "User One",
        email: "user1@example.com",
        birthDate: "1990-01-01",
        bio: "Bio",
        longBio: "Long bio",
        profileJson: {},
        address: "Address",
        phoneNumber: "1234567890",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        role: "admin",
        division: "Tech",
        displayName: "User One (admin)",
        bioDisplay: "Bio",
        instagramHandle: "@user1",
        totalUsers: 100,
        newerUsers: 10,
        logCount: 6,
        roleCount: 1,
        divisionCount: 1,
        loginCount: 2,
        updateCount: 1,
        recentLogs: 1,
        daysSinceCreated: 10,
        isActive: true,
        isSenior: true,
        socialMedia: {},
        preferences: {},
        skills: [],
        interests: [],
        hasProfile: true,
        hasBio: true,
        hasAddress: true,
        hasPhone: true,
        profileCompleteness: 80,
      },
      {
        id: 2,
        username: "user2",
        fullName: "User Two",
        email: "user2@example.com",
        birthDate: "1992-01-01",
        bio: "Bio",
        longBio: "Long bio",
        profileJson: {},
        address: "Address",
        phoneNumber: "1234567890",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        role: "user",
        division: "HR",
        displayName: "User Two (user)",
        bioDisplay: "Bio",
        instagramHandle: "@user2",
        totalUsers: 100,
        newerUsers: 10,
        logCount: 2,
        roleCount: 1,
        divisionCount: 1,
        loginCount: 2,
        updateCount: 1,
        recentLogs: 1,
        daysSinceCreated: 5,
        isActive: false,
        isSenior: false,
        socialMedia: {},
        preferences: {},
        skills: [],
        interests: [],
        hasProfile: true,
        hasBio: true,
        hasAddress: true,
        hasPhone: true,
        profileCompleteness: 50,
      },
      {
        id: 3,
        username: "user3",
        fullName: "User Three",
        email: "user3@example.com",
        birthDate: "1993-01-01",
        bio: "Bio",
        longBio: "Long bio",
        profileJson: {},
        address: "Address",
        phoneNumber: "1234567890",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        role: "user",
        division: "Tech",
        displayName: "User Three (user)",
        bioDisplay: "Bio",
        instagramHandle: "@user3",
        totalUsers: 100,
        newerUsers: 10,
        logCount: 7,
        roleCount: 1,
        divisionCount: 1,
        loginCount: 2,
        updateCount: 1,
        recentLogs: 1,
        daysSinceCreated: 2,
        isActive: true,
        isSenior: false,
        socialMedia: {},
        preferences: {},
        skills: [],
        interests: [],
        hasProfile: true,
        hasBio: true,
        hasAddress: true,
        hasPhone: true,
        profileCompleteness: 90,
      },
    ];
    const stats = aggregateUserStats(users);
    expect(stats.activeUsers.length).toBe(2);
    expect(stats.seniorUsers.length).toBe(1);
    expect(stats.usersWithCompleteProfiles.length).toBe(2);
    expect(stats.usersByDivision["Tech"]).toBe(2);
    expect(stats.usersByDivision["HR"]).toBe(1);
  });
});
