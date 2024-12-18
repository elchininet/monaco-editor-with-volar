// @ts-ignore
import * as worker from 'monaco-editor-core/esm/vs/editor/editor.worker.js';
import * as monaco from 'monaco-editor-core';
import {
    createTypeScriptWorkerLanguageService
} from '@volar/monaco/worker';
import ts from 'typescript';
import { create as createTypeScriptService } from 'volar-service-typescript';
import { URI } from 'vscode-uri';
import { createNpmFileSystem } from '@volar/jsdelivr';
import { createVueLanguagePlugin } from '@vue/language-core';
import * as vue from 'vue';

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
                    {
                        target: 3.3,
                        lib: 'vue',
                        extensions: ['.vue'],
                        vitePressExtensions: [],
                        petiteVueExtensions: [],
                        jsxSlots: false,
                        strictTemplates: false,
                        skipTemplateCodegen: false,
                        fallthroughAttributes: false,
                        dataAttributes: [],
                        htmlAttributes: ['aria-*'],
                        optionsWrapper: [
                            '(await import("vue")).defineComponent(',
                            ')'
                        ],
                        macros: {
                            defineEmits: ['defineEmits'],
                            defineExpose: ['defineExpose'],
                            defineModel: ['defineModel'],
                            defineOptions: ['defineOptions'],
                            defineProps: ['defineProps'],
                            defineSlots: ['defineSlots'],
                            withDefaults: ['withDefaults'],
                            
                        },
                        composibles: {
                            useCssModule: ['useCssModule'],
                            useTemplateRef: ['useTemplateRef']
                        },
                        plugins: [],
                        experimentalDefinePropProposal: false,
                        experimentalResolveStyleCssClasses: 'scoped',
                        experimentalModelPropName: {
                            "": { input: true },
                            value: {
                                input: { type: 'text' },
                                select: true,
                                textarea: true
                            }
                        }
                    },
                    uriConverter.asFileName
                )
            ],
            languageServicePlugins: [
                ...createTypeScriptService(ts)
            ]
        });

    });

};