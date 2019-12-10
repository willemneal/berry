import './polyfills';

import {Configuration, CommandContext, PluginConfiguration} from '@yarnpkg/core';
import {npath, PortablePath}                          from '@yarnpkg/fslib';
import {Cli}                                                from 'clipanion';
import {pluginConfiguration as defaultConfig} from './pluginConfiguration';



export async function main(args: string[] = [], pluginConfiguration: PluginConfiguration = defaultConfig) {
  async function run(): Promise<void> {
    const cli = new Cli<CommandContext>({
      binaryLabel: `Yarn Package Manager`,
      binaryName: `yarn`,
      binaryVersion: YARN_VERSION,
    });

    try {
      await exec(cli);
    } catch (error) {
      process.stdout.write(cli.error(error));
      process.exitCode = 1;
    }
  }

  async function exec(cli: Cli<CommandContext>): Promise<void> {
    // Since we only care about a few very specific settings (yarn-path and ignore-path) we tolerate extra configuration key.
    // If we didn't, we wouldn't even be able to run `yarn config` (which is recommended in the invalid config error message)
    const configuration = await Configuration.find(npath.toPortablePath(process.cwd()), pluginConfiguration, {
      strict: false,
    });


    // const yarnPath: PortablePath = configuration.get(`yarnPath`);
    const ignorePath = configuration.get(`ignorePath`);
    if (ignorePath)
      delete process.env.YARN_IGNORE_PATH;

    for (const plugin of configuration.plugins.values()){
      for (const command of plugin.commands || []) {
        cli.register(command);
      }
    }
    // console.log(configuration)

    const command = cli.process(args);

    // @ts-ignore: The cwd is a global option defined by BaseCommand
    const cwd: string | undefined = command.cwd;


    cli.runExit(command, {
      cwd: npath.toPortablePath(process.cwd()),
      plugins: pluginConfiguration,
      quiet: false,
      stdin: process.stdin,
      stdout: process.stdout,
      stderr: process.stderr,
    });

  }

  return run().catch(error => {
    process.stdout.write(error.stack || error.message);
    process.exitCode = 1;
  });
}
