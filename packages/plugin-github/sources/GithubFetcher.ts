import {Fetcher, FetchOptions, MinimalFetchOptions} from '@yarnpkg/core';
import {Locator, MessageName}                       from '@yarnpkg/core';
import {httpUtils, structUtils, tgzUtils}           from '@yarnpkg/core';
import {PortablePath}                               from '@yarnpkg/fslib';

import * as githubUtils                             from './githubUtils';

export class GithubFetcher implements Fetcher {
  supports(locator: Locator, opts: MinimalFetchOptions) {
    if (!githubUtils.isGithubUrl(locator.reference))
      return false;

    return true;
  }

  getLocalPath(locator: Locator, opts: FetchOptions) {
    return null;
  }

  async fetch(locator: Locator, opts: FetchOptions) {
    const expectedChecksum = opts.checksums.get(locator.locatorHash) || null;

    const [packageFs, releaseFs, checksum] = await opts.cache.fetchPackageFromCache(
      locator,
      expectedChecksum,
      async () => {
        opts.report.reportInfoOnce(MessageName.FETCH_NOT_CACHED, `${structUtils.prettyLocator(opts.project.configuration, locator)} can't be found in the cache and will be fetched from the remote repository`);
        return await this.fetchFromNetwork(locator, opts);
      },
    );

    return {
      packageFs,
      releaseFs,
      prefixPath: `/sources` as PortablePath,
      checksum,
    };
  }

  async fetchFromNetwork(locator: Locator, opts: FetchOptions) {
    const sourceBuffer = await httpUtils.get(this.getLocatorUrl(locator, opts), {
      configuration: opts.project.configuration,
    });

    return await tgzUtils.makeArchive(sourceBuffer, {
      stripComponents: 1,
      prefixPath: `/sources` as PortablePath,
    });
  }

  private getLocatorUrl(locator: Locator, opts: MinimalFetchOptions) {
    const {username, reponame, branch = `master`} = githubUtils.parseGithubUrl(locator.reference);

    return `https://github.com/${username}/${reponame}/archive/${branch}.tar.gz`;
  }
}
