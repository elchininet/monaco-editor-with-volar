// @ts-ignore
import * as worker from 'monaco-editor-core/esm/vs/editor/editor.worker.js';
import * as monaco from 'monaco-editor-core';
import { resolveConfig } from '@vue/language-service';
import { createLanguageService } from '@volar/monaco/worker';
import createTsService, { createJsDelivrDtsHost } from 'volar-service-typescript';
import ts from 'typescript';

self.onmessage = () => {

    worker.initialize((ctx: monaco.worker.IWorkerContext) => {

        const compilerOptions: ts.CompilerOptions = {
            ...ts.getDefaultCompilerOptions(),
            allowJs: true,
            checkJs: true,
            jsx: ts.JsxEmit.Preserve,
            module: ts.ModuleKind.ESNext,
            target: ts.ScriptTarget.ESNext,
            moduleResolution: ts.ModuleResolutionKind.NodeNext,
        };

        return createLanguageService({
            workerContext: ctx,
            config: resolveConfig(
                {
                    services: {
                        typescript: createTsService(
                            {
                                dtsHost: createJsDelivrDtsHost()
                            }
                        ),
                    },
                },
                compilerOptions as any,
                undefined,
                undefined,
                ts as any
            ),
            typescript: {
                module: ts as any,
                compilerOptions: compilerOptions as any,
            },
        });

    });

};