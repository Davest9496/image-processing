import { SpecReporter, StacktraceOption } from 'jasmine-spec-reporter';

jasmine.getEnv().clearReporters();
jasmine.getEnv().addReporter(
  new SpecReporter({
    spec: {
      displayStacktrace: StacktraceOption.NONE,
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
  })
);
