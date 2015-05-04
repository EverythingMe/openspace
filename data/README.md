# Openspace data tool

This tool allows you to update your *projects.json* data file based on a combination of - Github repos, filters and existing data file.

It's capable of merging existing data, and will only override the following fields - *description*, *stars_count*, *forks_count*

## Usage

#### Simple

``` 
python prepare_data.py --user USER --verbose
```

You can add *--dry-run* flag to see the output wihtout writing the actual file

#### Merging

Merging is done by reading an existing *projects.json* file and using its data (which can be manually edited) as the base data, existing projects will only have specific fields updated from GitHub.

``` 
python prepare_data.py --user USER --merge-existing --existing-file projects.json --verbose
```

#### Filtering projects

If you'd like to filter some of your repos, you can do so by either providing a config yaml file (via click-config) or simply pass multiple *-f REPO_NAME*

```
python prepare_data.py --user USER --merge-existing --existing-file projects.json -f project1 -f project2 --verbose
```

You can also use a YAML config file in the following structure:

**config.yml**

```
filters:
    repos:
        - pyfrank
        - gofullscreen
        - webp-test
        - sublime.me
        - gaia.me
        - chef-redash
        - android-logger
        - cql_dump
        - everythingme.github.io
```

Then you can simply add *--conf YAML_FILE* 

```
python prepare_data.py --user USER --merge-existing --existing-file projects.json --conf config.yaml --verbose
```