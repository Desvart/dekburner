# To do's

## Project capabilities
- [ ] Unit test
- [ ] SonarCloud
- [ ] Publish to GitHub
- [ ] Prettier
- [ ] Linter
- [ ] Deploy on different environments
- [ ] custome loger to enable or disable DEBUG mode module by module

## CI/CD pipeline
- [ ] Configure global script to build multiple modules at once with tsc -b --watch and then execute local script.
- [ ] Link the deploy command to the SonarCloud gate result
- [ ] Split the actions in SonarClouds with the saveArtifact and loadArtifact steps
- [ ] Configure the CI/CD pipeline to
  - deploy continuously to the CI environment
  - deploy on demand to the ctlq (Firefox) environment (with unit test gate)
  - deploy on demand to the prod (Steam) environment (with unit test gate & sonar gate)
- [ ] Adapt bitburner-filesync project to be able to load different config files for different environments
- [ ] Configure the unit test project to run locally and in the CI/CD pipeline