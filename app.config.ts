/// <reference types="node" />
// Configuração dinâmica do Expo (executada no Node durante o start e a build).
import { execSync } from 'node:child_process';

import type { ConfigContext, ExpoConfig } from 'expo/config';

// Executa um comando git; retorna null se o git não estiver disponível.
function runGit(command: string): string | null {
  try {
    return execSync(`git ${command}`, {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
  } catch {
    return null;
  }
}

// No EAS Build o código é enviado a partir do commit e o hash vem de EAS_BUILD_GIT_COMMIT_HASH.
const easCommitHash = process.env.EAS_BUILD_GIT_COMMIT_HASH;

// Hash do commit de referência exibido na tela "Sobre o App".
const commitHash = easCommitHash ?? runGit('rev-parse HEAD') ?? 'indisponível';

// Indica se a build foi gerada com alterações ainda não commitadas.
// No EAS a árvore limpa é garantida pelo "requireCommit" do eas.json (o envio é recusado se
// houver alterações), e lá o git status não é confiável: o próprio processo de build altera
// arquivos. Por isso a verificação só é feita nas builds locais.
const workingTreeStatus = easCommitHash ? '' : runGit('status --porcelain');
const hasUncommittedChanges = workingTreeStatus !== null && workingTreeStatus.length > 0;

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: config.name ?? 'Nexus Verde',
  slug: config.slug ?? 'nexus-verde',
  extra: {
    ...config.extra,
    commitHash,
    hasUncommittedChanges,
    builtAt: new Date().toISOString(),
    repositoryUrl: 'https://github.com/rm562258-ui/GS-2',
  },
});
