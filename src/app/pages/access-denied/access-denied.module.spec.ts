import { AccessDeniedModule } from "./access-denied.module";

describe('AccessDeniedModule', () => {
  let maintenComingSoonModule: AccessDeniedModule;

  beforeEach(() => {
    maintenComingSoonModule = new AccessDeniedModule();
  });

  it('should create an instance', () => {
    expect(maintenComingSoonModule).toBeTruthy();
  });
});
