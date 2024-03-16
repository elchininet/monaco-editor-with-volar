import { editor, languages, Uri } from 'monaco-editor-core';
import { LanguageService } from '@vue/language-service';
import * as volar from '@volar/monaco';
import { VUE, INITIAL_CODE } from './constants';
import { getOrCreateModel } from './utilities';
import './styles.scss';

let initialized = false;

const setup = async () => {

    if (initialized) return;

    initialized = true;

    self.MonacoEnvironment = {
        getWorker(__workerId: string, label: string): Worker | Promise<Worker> {
            if (label === VUE) {
                return new Worker(
                    new URL(
                        './vue.worker.ts',
                        import.meta.url
                    )
                );
            }
            return new Worker(
                new URL(
                    'monaco-editor-core/esm/vs/editor/editor.worker.js',
                    import.meta.url
                )
            );
        }
    };

    const worker = editor.createWebWorker<LanguageService>({
		moduleId: `vs/language/${VUE}/${VUE}Worker`,
		label: VUE,
        createData: {},
	});
    const getSyncUris = () => editor.getModels().map((model) => model.uri);
    volar.editor.activateMarkers(
		worker,
		[VUE],
		VUE,
		getSyncUris,
		editor
	);
    volar.editor.activateAutoInsertion(
		worker,
		[VUE],
		getSyncUris,
		editor
	);
    await volar.languages.registerProvides(
        worker,
        [VUE],
        getSyncUris,
        languages
    );

    getOrCreateModel(Uri.parse('file:///node_modules/@bookingcom/bui-vue/index.d.ts'), VUE,
        `
        import { DefineComponent } from 'vue';
        declare module 'vue' {
            export interface GlobalComponents {
                'BuiContainer': DefineComponent<{ centered?: boolean; variant?: 'vertical' | 'horizontal' | 'partial' }>,
            }
        }
        export {};
        `
    );

};

languages.register(
    {
        id: VUE,
        extensions: [`.${VUE}`]
    }
);

languages.onLanguage(VUE, setup);

const instance = editor.create(
    document.getElementById('editor') as HTMLElement,
    {
        theme: 'vs-dark',
        model: editor.createModel(
            INITIAL_CODE,
            VUE,
            Uri.parse('file:///main.vue')
        ),
        automaticLayout: true,
        scrollBeyondLastLine: false,
        minimap: {
            enabled: false,
        },
        inlineSuggest: {
            enabled: false,
        },
        'semanticHighlighting.enabled': true,
    }
);

