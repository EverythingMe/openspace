import json
import requests
import click
import click_config
from operator import itemgetter
try:
    from urllib.parse import urlparse
except ImportError:
    from urlparse import urlparse
import logging

__author__ = 'joeysim'

PAGE_SIZE = 500

# This tool builds / updates the projects.json file
# it will update the following fields: description, stars_count, forks_count

class config(object):
    class filters(object):
        repos = []

def setupLogging(verbose):
    #Setup Logging
    logging.basicConfig(
        level = logging.DEBUG if verbose else logging.INFO,
        format= '[%(asctime)s %(levelname)s] in %(module)s.%(funcName)s:%(lineno)s: %(message)s',
        datefmt='%m/%d/%Y %H:%M:%S')
    logging.getLogger("requests").propagate = False

def get_repos_from_github(user):

    logging.info('Fetching user info for %s', user)
    user_url = 'https://api.github.com/users/%s' % user
    req = requests.get(user_url)
    user_data = req.json()

    public_repos_count = user_data['public_repos']
    repo_url = user_data['repos_url']
    repo_url += '?type=public&per_page=%s&page=%s'

    # Fetch repos data
    all_repos = []

    logging.info('Fetching repo info for %s repos', public_repos_count)
    # TODO: should be replaced with a range that fits the # of repos
    for page in range(1, int(public_repos_count / PAGE_SIZE) + 2):
        logging.info('Fetching repos page #%s', page)
        req = requests.get(repo_url % (PAGE_SIZE, page))
        repos_data = req.json()
        if repos_data and len(repos_data)>0:
            all_repos += repos_data
        else:
            logging.info('no more repos (should not happen if calculation is right)')
            break

    logging.info('Total fetched repos - %s', len(all_repos))

    return all_repos

def filter_repos(github_repos, repos_to_filter):
    if repos_to_filter:
        logging.info('repos that will be filtered - %s', repos_to_filter)

    filtered_repos = []

    for repo in github_repos:
        # filter non-public and fork repos (we request for public repos so might be partially redundant)
        if not repo['fork'] and not repo['private']:
            if not repo['name'] in repos_to_filter:
                repo_data = {}
                repo_data['name']           = repo['name']
                repo_data['description']    = repo['description']
                repo_data['stars_count']    = repo['stargazers_count']
                repo_data['forks_count']    = repo['forks_count']
                repo_data['tags']           = [repo['language']]

                repo_data['links']          = []

                github_link = {
                    'url': repo['html_url'],
                    'title':'github'
                }
                repo_data['links'].append(github_link)

                if 'homepage' in repo_data:
                    homepage_link = {
                        'url': repo['homepage'],
                        'title': urlparse(repo['homepage']).netloc,
                        'class': 'mdi-action-home' # TODO: find a different approach
                    }
                    repo_data['links'].append(homepage_link)

                repo_data['icon_url']       = ''
                repo_data['icon_class']     = ''

                filtered_repos.append(repo_data)

                # logging.info(repo_data

    logging.info('Total output repos - %s', len(filtered_repos))
    return filtered_repos

def merge_lists(github_repos, local_repos):
    output = []
    logging.info('Merging results between local file and GitHub output')
    for gh_repo in github_repos:
        # check if GitHub repo is in the local ones
        if any((r['name']==gh_repo['name'] for r in local_repos)):
            # If so update
            for r in local_repos:
                if r['name']== gh_repo['name']:
                    local_repo = r
                    break

            # update description and counts
            local_repo['description'] = gh_repo['description']
            local_repo['stars_count'] = gh_repo['stars_count']
            local_repo['forks_count'] = gh_repo['forks_count']

            # TODO: deal with homepages & tags as well
            # verify language is in tags (not a must...)
            # if not gh_repo['language'] in local_repo['tags']:
            #     local_repo['tags'].append(gh_repo['language'])

            output.append(local_repo)
        else:
            # Otherwise add it
            output.append(gh_repo)
    return output

@click.command()
@click_config.wrap(module=config, sections=('repos',))
@click.option('--user', type=str, required=True, help='The GitHub user to fetch projects from.')
@click.option('--merge-existing', is_flag=True, default=False, help='Do we merge with existing file.')
@click.option('--existing-file', type=str, required=False, default='projects.json', help='The existing data file to merge with.')
@click.option('--output-file', type=str, required=True, default='updated_projects.json', help='The data output file (defaults to data.json).')
@click.option('--dry-run', is_flag=True, default=False, help='Runs the entire process, without writing the output file.')
@click.option('--filtered-repos', '-f', type=str, multiple=True, required=False, help='Repos to filter.')
@click.option('--verbose', '-v', is_flag=True, default=True, help='Verbose output')
def main(user, filtered_repos, merge_existing, existing_file, output_file, dry_run, verbose):

    output_repos = []
    setupLogging(verbose)

    # init the repos_blacklist
    repos_to_filter = config.filters.repos or filtered_repos or []

    # Get the a filteresd and sorted user's public GitHub repos
    github_repos = get_repos_from_github(user)
    github_repos = filter_repos(github_repos, repos_to_filter)
    github_repos = sorted(github_repos, key=itemgetter('stars_count', 'forks_count'), reverse=True)

    # We start with an output that's GitHub only
    output_repos = github_repos

    # if we're requested to merge, we load the existing data file
    if merge_existing:
        if existing_file:
            with open(existing_file, 'r') as f:
                local_repos = json.load(f)
            output_repos = merge_lists(github_repos, local_repos)
        else:
            logging.error('merge requeseted but no existing file found')
    else:
        logging.info('Using only GitHub repos (no merge)')

    # Emit output
    if dry_run:
        logging.info('Dry run, output is \n %s', json.dumps(output_repos, indent=2))
        if merge_existing:
            logging.error('Dry run was requested yet merge flag is on - no output will be written')
    else:
        with open(output_file, 'w') as f:
            f.write(json.dumps(output_repos, indent=2))

if __name__ == '__main__':
    main()
