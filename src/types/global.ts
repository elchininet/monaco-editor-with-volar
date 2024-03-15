import { Environment } from 'monaco-editor-core';

declare global {
    interface Window {
        MonacoEnvironment: Environment;
    }
}

export {};