"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jasmine_spec_reporter_1 = require("jasmine-spec-reporter");
jasmine.getEnv().clearReporters();
jasmine.getEnv().addReporter(new jasmine_spec_reporter_1.SpecReporter({
    spec: {
        displayStacktrace: jasmine_spec_reporter_1.StacktraceOption.NONE,
        displaySuccessful: true,
        displayFailed: true,
        displayPending: true,
        displayDuration: true,
    },
    summary: {
        displaySuccessful: false,
        displayFailed: true,
        displayPending: false,
    },
}));
//# sourceMappingURL=reporters.js.map