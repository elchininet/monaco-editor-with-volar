// @ts-ignore
import * as worker from 'monaco-editor-core/esm/vs/editor/editor.worker.js';
import * as monaco from 'monaco-editor-core';
import {
    createTypeScriptWorkerService,
    activateAutomaticTypeAcquisition,
    ServiceEnvironment
} from '@volar/monaco/worker';
import ts from 'typescript';
import { create as createTypeScriptService } from 'volar-service-typescript';

self.onmessage = () => {

    worker.initialize((ctx: monaco.worker.IWorkerContext) => {

        const env: ServiceEnvironment = {
            workspaceFolder: 'file:///',
            typescript: {
                uriToFileName: uri => {
                    console.log('uri ==>', uri);
                    return uri.substring('file://'.length);
                },
                fileNameToUri: fileName => {
                    console.log('filename ==>', fileName);
                    return 'file:///' + fileName;
                },
            }
        };

        activateAutomaticTypeAcquisition(env);

        return createTypeScriptWorkerService({
            typescript: ts,
            compilerOptions: {
                module: ts.ModuleKind.ESNext,
                moduleResolution: ts.ModuleResolutionKind.NodeNext
            },
            workerContext: ctx,
            env,
            languagePlugins: [],
            servicePlugins: [
                ...createTypeScriptService(ts)
            ]
        });

    });

};