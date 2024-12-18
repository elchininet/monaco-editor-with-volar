// @ts-ignore
import * as worker from 'monaco-editor-core/esm/vs/editor/editor.worker.js';
import * as monaco from 'monaco-editor-core';
import {
    createTypeScriptWorkerLanguageService
} from '@volar/monaco/worker';
import ts from 'typescript';
import { URI } from 'vscode-uri';
import { createNpmFileSystem } from '@volar/jsdelivr';
import { createVueLanguagePlugin, resolveVueCompilerOptions } from '@vue/language-core';
import { getFullLanguageServicePlugins } from '@vue/language-service';

type ServiceEnvironment = Parameters<(typeof createTypeScriptWorkerLanguageService)>[0]['env'];

self.onmessage = () => {

    worker.initialize((ctx: monaco.worker.IWorkerContext) => {

        const env: ServiceEnvironment = {
            workspaceFolders: [
                URI.parse('file:///')
            ]
        };

        const uriConverter = {
            asFileName: (uri: URI) => uri.fsPath,
            asUri: (fileName: string) => URI.file(fileName),
        };

        env.fs = createNpmFileSystem();

        const compilerOptions = {
            ...ts.getDefaultCompilerOptions(),
            allowJs: true,
            jsx: ts.JsxEmit.Preserve,
            module: ts.ModuleKind.ESNext,
            moduleResolution: ts.ModuleResolutionKind.NodeNext,
        };

        return createTypeScriptWorkerLanguageService({
            typescript: ts,
            compilerOptions,
            uriConverter,
            workerContext: ctx,
            env,
            languagePlugins: [
                createVueLanguagePlugin(
                    ts,
                    compilerOptions,
                    resolveVueCompilerOptions({}),
                    uriConverter.asFileName
                )
            ],
            languageServicePlugins: [
                ...getFullLanguageServicePlugins(ts)
            ]
        });

    });

};