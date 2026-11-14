import Constants from 'expo-constants';

type BuildExtra = {
  commitHash?: string;
  hasUncommittedChanges?: boolean;
  builtAt?: string;
  repositoryUrl?: string;
};

const expoConfig = Constants.expoConfig;
const extra = (expoConfig?.extra ?? {}) as BuildExtra;
const commitHash = extra.commitHash ?? 'indisponível';

// Dados da versão instalada, gerados no app.config.ts no momento da build.
export const buildInfo = {
  appName: expoConfig?.name ?? 'Nexus Verde',
  version: expoConfig?.version ?? '1.0.0',
  commitHash,
  shortCommitHash: commitHash.length >= 7 ? commitHash.slice(0, 7) : commitHash,
  hasUncommittedChanges: extra.hasUncommittedChanges ?? false,
  builtAt: extra.builtAt,
  repositoryUrl: extra.repositoryUrl,
};
