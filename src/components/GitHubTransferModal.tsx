import React, { useState } from 'react';
import { 
  GitBranch, 
  Terminal, 
  Check, 
  Copy, 
  ExternalLink, 
  Globe, 
  UploadCloud, 
  AlertCircle, 
  CheckCircle2, 
  Lock,
  ArrowRight
} from 'lucide-react';
import { ToolConfig } from '../types';
import { generateSingleFileHtml } from '../utils/singleFileHtmlGenerator';

interface GitHubTransferModalProps {
  config: ToolConfig;
  isOpen: boolean;
  onClose: () => void;
}

export const GitHubTransferModal: React.FC<GitHubTransferModalProps> = ({
  config,
  isOpen,
  onClose
}) => {
  const [activeMethod, setActiveMethod] = useState<'api' | 'terminal' | 'web'>('api');
  
  // Direct API Push Form State
  const [githubToken, setGithubToken] = useState('');
  const [repoName, setRepoName] = useState(() => 
    (config.toolTitle || 'html-tool-prompt-studio')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '') || 'html-tool-studio'
  );
  const [isPrivate, setIsPrivate] = useState(false);
  const [isPushing, setIsPushing] = useState(false);
  const [pushStatus, setPushStatus] = useState<string | null>(null);
  const [repoUrl, setRepoUrl] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);

  if (!isOpen) return null;

  const terminalCommands = `# 1. Add your GitHub remote repository URL
git remote add origin https://github.com/YOUR_USERNAME/${repoName}.git

# 2. Ensure main branch is set
git branch -M main

# 3. Push all commits to GitHub
git push -u origin main`;

  const handleCopyCmd = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCmd(id);
    setTimeout(() => setCopiedCmd(null), 2000);
  };

  /**
   * Pushes the standalone HTML tool, README, and configuration directly to GitHub
   * via GitHub REST API without requiring any local CLI setup.
   */
  const handlePushToGithub = async () => {
    if (!githubToken.trim()) {
      setErrorMsg('Please provide a GitHub Personal Access Token with repo scope.');
      return;
    }
    if (!repoName.trim()) {
      setErrorMsg('Please specify a repository name.');
      return;
    }

    setErrorMsg(null);
    setIsPushing(true);
    setPushStatus('Authenticating with GitHub...');

    try {
      // Step 1: Verify token and get username
      const userRes = await fetch('https://api.github.com/user', {
        headers: {
          Authorization: `token ${githubToken.trim()}`,
          Accept: 'application/vnd.github.v3+json'
        }
      });

      if (!userRes.ok) {
        throw new Error('Invalid GitHub token. Please verify your token permissions (requires "repo" scope).');
      }

      const userData = await userRes.json();
      const username = userData.login;
      setPushStatus(`Authenticated as @${username}. Preparing repository "${repoName}"...`);

      // Step 2: Create repo or check if exists
      let createdRepoUrl = `https://github.com/${username}/${repoName}`;
      const repoCheck = await fetch(`https://api.github.com/repos/${username}/${repoName}`, {
        headers: {
          Authorization: `token ${githubToken.trim()}`,
          Accept: 'application/vnd.github.v3+json'
        }
      });

      if (repoCheck.status === 404) {
        setPushStatus(`Creating new ${isPrivate ? 'private' : 'public'} repository on GitHub...`);
        const createRes = await fetch('https://api.github.com/user/repos', {
          method: 'POST',
          headers: {
            Authorization: `token ${githubToken.trim()}`,
            Accept: 'application/vnd.github.v3+json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            name: repoName,
            description: `${config.toolTitle || 'HTML Tool'} - Standalone single-file HTML application built with HTML Tool Studio`,
            private: isPrivate,
            auto_init: true
          })
        });

        if (!createRes.ok) {
          const err = await createRes.json();
          throw new Error(err.message || 'Failed to create GitHub repository.');
        }

        const newRepo = await createRes.json();
        createdRepoUrl = newRepo.html_url;
        // Brief pause to allow GitHub repo init to propagate
        await new Promise((r) => setTimeout(r, 1500));
      }

      // Step 3: Prepare and commit files
      setPushStatus('Generating standalone single-file HTML tool...');
      const singleHtml = generateSingleFileHtml(config);
      
      const filesToCommit = [
        {
          path: 'html_tool.html',
          content: btoa(unescape(encodeURIComponent(singleHtml))),
          message: 'Add standalone single-file HTML tool (offline double-click ready)'
        },
        {
          path: 'index.html',
          content: btoa(unescape(encodeURIComponent(singleHtml))),
          message: 'Add index.html for direct GitHub Pages live deployment'
        },
        {
          path: 'README.md',
          content: btoa(unescape(encodeURIComponent(`# ${config.toolTitle || 'HTML Tool'}\n\n${config.goalDescription}\n\n## 🚀 Live Demo on GitHub Pages\nThis repository is configured to open directly in your browser without any external dependencies.\n\n### How to Run Locally\n1. Download or clone this repository.\n2. Double click \`html_tool.html\` or \`index.html\`.\n3. The tool runs 100% offline with zero dependencies.\n\n### Inputs Defined (${config.inputs.length}):\n${config.inputs.map((inp, idx) => `${idx + 1}. **${inp.name}** (${inp.type}) - Validation: \`${inp.validation}\``).join('\n')}\n\n### Outputs Defined (${config.outputs.length}):\n${config.outputs.map((out, idx) => `${idx + 1}. **${out.name}** (${out.format}) - Action: \`${out.action}\``).join('\n')}\n`))),
          message: 'Add comprehensive README.md'
        }
      ];

      for (const f of filesToCommit) {
        setPushStatus(`Committing ${f.path}...`);
        
        // Check existing file SHA if updating
        let sha: string | undefined;
        const fileCheck = await fetch(`https://api.github.com/repos/${username}/${repoName}/contents/${f.path}`, {
          headers: {
            Authorization: `token ${githubToken.trim()}`,
            Accept: 'application/vnd.github.v3+json'
          }
        });

        if (fileCheck.ok) {
          const fileData = await fileCheck.json();
          sha = fileData.sha;
        }

        const putRes = await fetch(`https://api.github.com/repos/${username}/${repoName}/contents/${f.path}`, {
          method: 'PUT',
          headers: {
            Authorization: `token ${githubToken.trim()}`,
            Accept: 'application/vnd.github.v3+json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            message: f.message,
            content: f.content,
            branch: 'main',
            ...(sha ? { sha } : {})
          })
        });

        if (!putRes.ok) {
          // If main branch doesn't exist yet, try master
          const fallbackRes = await fetch(`https://api.github.com/repos/${username}/${repoName}/contents/${f.path}`, {
            method: 'PUT',
            headers: {
              Authorization: `token ${githubToken.trim()}`,
              Accept: 'application/vnd.github.v3+json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              message: f.message,
              content: f.content,
              ...(sha ? { sha } : {})
            })
          });

          if (!fallbackRes.ok) {
            const putErr = await fallbackRes.json();
            throw new Error(`Failed to commit ${f.path}: ${putErr.message}`);
          }
        }
      }

      setRepoUrl(createdRepoUrl);
      setPushStatus(`Transferred successfully! Repository available at ${createdRepoUrl}`);
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Transfer to GitHub failed.');
      setPushStatus(null);
    } finally {
      setIsPushing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-slate-900 text-white">
              <GitBranch className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Transfer HTML Tool to GitHub
              </h2>
              <p className="text-xs text-slate-500">
                Choose your preferred method to publish or push this tool repository to GitHub.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Method Segmented Switcher */}
        <div className="p-5 pb-0">
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl">
            <button
              onClick={() => setActiveMethod('api')}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                activeMethod === 'api'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <UploadCloud className="w-3.5 h-3.5" />
              <span>1-Click Direct Push (API)</span>
            </button>

            <button
              onClick={() => setActiveMethod('terminal')}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                activeMethod === 'terminal'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>Git Terminal Commands</span>
            </button>

            <button
              onClick={() => setActiveMethod('web')}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                activeMethod === 'web'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Web Drag & Drop</span>
            </button>
          </div>
        </div>

        {/* Tab 1: 1-Click Direct Push via GitHub REST API */}
        {activeMethod === 'api' && (
          <div className="p-5 space-y-4">
            
            {repoUrl ? (
              <div className="p-5 bg-emerald-50 border border-emerald-200 rounded-xl text-center space-y-3">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-emerald-950">
                    Repository Published Successfully!
                  </h3>
                  <p className="text-xs text-emerald-700 mt-1">
                    Your HTML tool, README, and configuration are now live on GitHub.
                  </p>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-2">
                  <a
                    href={repoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors"
                  >
                    <span>View Repository on GitHub</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>

                  <a
                    href={`${repoUrl}/blob/main/html_tool.html`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition-colors"
                  >
                    <span>View html_tool.html</span>
                  </a>
                </div>
              </div>
            ) : (
              <>
                <div className="p-3.5 bg-blue-50/70 border border-blue-100 rounded-xl text-xs text-blue-900 leading-relaxed">
                  <strong>Direct In-Browser Push:</strong> Creates a repository directly under your GitHub account and commits <code>html_tool.html</code>, <code>index.html</code>, and <code>README.md</code> automatically.
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-800 mb-1 flex items-center justify-between">
                      <span className="flex items-center gap-1">
                        <Lock className="w-3.5 h-3.5 text-slate-400" />
                        <span>GitHub Personal Access Token (PAT)</span>
                      </span>
                      <a
                        href="https://github.com/settings/tokens/new?scopes=repo&description=HTML+Tool+Studio+Publish"
                        target="_blank"
                        rel="noreferrer"
                        className="text-[11px] text-blue-600 hover:underline flex items-center gap-1 font-normal"
                      >
                        <span>Generate Token on GitHub</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </label>
                    <input
                      type="password"
                      value={githubToken}
                      onChange={(e) => setGithubToken(e.target.value)}
                      placeholder="ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                      className="w-full px-3 py-2 text-xs sm:text-sm font-mono text-slate-900 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15"
                    />
                    <span className="text-[10px] text-slate-400 mt-1 block">
                      Needs <code>repo</code> scope to create repositories and commit files. Never stored or shared.
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-800 mb-1">
                        Repository Name
                      </label>
                      <input
                        type="text"
                        value={repoName}
                        onChange={(e) => setRepoName(e.target.value)}
                        placeholder="html-tool-prompt-studio"
                        className="w-full px-3 py-2 text-xs sm:text-sm font-mono text-slate-900 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-800 mb-1">
                        Visibility
                      </label>
                      <select
                        value={isPrivate ? 'private' : 'public'}
                        onChange={(e) => setIsPrivate(e.target.value === 'private')}
                        className="w-full px-3 py-2 text-xs sm:text-sm text-slate-900 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 cursor-pointer"
                      >
                        <option value="public">Public (Recommended for GitHub Pages)</option>
                        <option value="private">Private</option>
                      </select>
                    </div>
                  </div>
                </div>

                {errorMsg && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                {pushStatus && (
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 font-mono">
                    {pushStatus}
                  </div>
                )}

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    onClick={onClose}
                    className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handlePushToGithub}
                    disabled={isPushing}
                    className="inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 disabled:opacity-50 rounded-lg transition-colors cursor-pointer"
                  >
                    <UploadCloud className="w-4 h-4" />
                    <span>{isPushing ? 'Transferring...' : 'Create & Push to GitHub'}</span>
                  </button>
                </div>
              </>
            )}

          </div>
        )}

        {/* Tab 2: Git Terminal Commands */}
        {activeMethod === 'terminal' && (
          <div className="p-5 space-y-4">
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 leading-relaxed">
              <strong>Local Git Repository Ready:</strong> This project already has a git repository initialized with a clean root commit. Run these commands to push directly to your remote repository:
            </div>

            <div className="relative rounded-xl overflow-hidden border border-slate-800 bg-slate-950 p-4">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800 text-xs font-mono text-slate-400">
                <span>bash terminal</span>
                <button
                  onClick={() => handleCopyCmd(terminalCommands, 'cmd-all')}
                  className="flex items-center gap-1 text-xs text-slate-300 hover:text-white"
                >
                  {copiedCmd === 'cmd-all' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCmd === 'cmd-all' ? 'Copied!' : 'Copy Commands'}</span>
                </button>
              </div>
              <pre className="font-mono text-xs text-slate-200 whitespace-pre-wrap leading-relaxed">
                {terminalCommands}
              </pre>
            </div>

            <div className="space-y-2 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900">Step 1:</span>
                <span>Create an empty repository named <code>{repoName}</code> at <a href="https://github.com/new" target="_blank" rel="noreferrer" className="text-blue-600 hover:underline inline-flex items-center gap-0.5">github.com/new <ExternalLink className="w-2.5 h-2.5" /></a></span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900">Step 2:</span>
                <span>Paste and run the commands above in your local project terminal.</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900">Step 3:</span>
                <span>Enable GitHub Pages under <strong>Settings</strong> &gt; <strong>Pages</strong> to get a live URL.</span>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        )}

        {/* Tab 3: Web Drag & Drop */}
        {activeMethod === 'web' && (
          <div className="p-5 space-y-4">
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 leading-relaxed">
              <strong>Zero-Setup Web Upload:</strong> You can upload <code>html_tool.html</code> directly on GitHub without installing git:
            </div>

            <ol className="space-y-3 text-xs text-slate-700 list-decimal pl-4">
              <li>
                Go to <a href="https://github.com/new" target="_blank" rel="noreferrer" className="text-blue-600 font-semibold hover:underline inline-flex items-center gap-1">github.com/new <ExternalLink className="w-3 h-3" /></a> and create a new repository (e.g. <code>{repoName}</code>). Check <em>"Add a README file"</em>.
              </li>
              <li>
                Click <strong>"Add file"</strong> &gt; <strong>"Upload files"</strong> in your new repository.
              </li>
              <li>
                Drag and drop <strong><code>html_tool.html</code></strong> (downloaded using the button below) into the upload area.
              </li>
              <li>
                Click <strong>"Commit changes"</strong>.
              </li>
              <li>
                Under <strong>Settings</strong> &gt; <strong>Pages</strong>, set branch to <code>main</code> and save. Your tool is now live on the web!
              </li>
            </ol>

            <div className="pt-3 flex items-center justify-between border-t border-slate-100">
              <a
                href="https://github.com/new"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700"
              >
                <span>Open GitHub New Repo</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>

              <button
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
