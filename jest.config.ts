module.exports = {
  collectCoverage: true,
  // on node 14.x coverage provider v8 offers good speed and more or less good report
  coverageProvider: "v8",
  collectCoverageFrom: [
    "**/*.{js,jsx,ts,tsx}",
    "!**/*.d.ts",
    "!**/node_modules/**",
    "!<rootDir>/out/**",
    "!<rootDir>/.next/**",
    "!<rootDir>/*.config.js",
    "!<rootDir>/coverage/**",
  ],
  //   moduleNameMapper: {
  //     // Handle CSS imports (with CSS modules)
  //     // https://jestjs.io/docs/webpack#mocking-css-modules
  //     "^.+\\.module\\.(css|sass|scss)$": "identity-obj-proxy",

  //     // Handle CSS imports (without CSS modules)
  //     "^.+\\.(css|sass|scss)$": "<rootDir>/__mocks__/styleMock.js",

  //     // Handle image imports
  //     // https://jestjs.io/docs/webpack#handling-static-assets
  //     "^.+\\.(png|jpg|jpeg|gif|webp|avif|ico|bmp|svg)$": `<rootDir>/__mocks__/fileMock.js`,

  //     // Handle module aliases
  //     "^@/components/(.*)$": "<rootDir>/components/$1",

  //     // Handle @next/font
  //     "@next/font/(.*)": `<rootDir>/__mocks__/nextFontMock.js`,
  //     // Handle next/font
  //     "next/font/(.*)": `<rootDir>/__mocks__/nextFontMock.js`,
  //     // Disable server-only
  //     "server-only": `<rootDir>/__mocks__/empty.js`,
  //   },
  // Add more setup options before each test is run
  //   setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  testPathIgnorePatterns: ["<rootDir>/node_modules/", "<rootDir>/.next/"],
  testEnvironment: "jsdom",
  //   transform: {
  //     "^.+\\.(js|jsx|ts|tsx)$": "ts-jest",
  //   },
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"], // Update file name if changed
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest",
    "^.+\\.(js|jsx)$": "babel-jest",
  },
  transformIgnorePatterns: ["/node_modules/"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1", // Adjust the root directory to "src"
  },
};
