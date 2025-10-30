根目录下.gitlab-ci.yml，项目名称要起username.gitlab.io

```shell
pages:
  stage: deploy
  # This creates a folder called public and copies all your website files into it. GitLab Pages uses this folder to serve your website by default
  script:
    - mkdir .public
    - cp -r * .public
    - mv .public public
  artifacts:
    paths:
      - public
  # only update your website when changes are made to the main branch
  only:
    - main
```

https://about.gitlab.com/blog/build-a-new-website-in-a-few-easy-steps-with-gitlab-pages/
