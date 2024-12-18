import { editor, languages, Uri } from 'monaco-editor-core';
import { WorkerLanguageService } from '@volar/monaco/worker';
import { activateMarkers, activateAutoInsertion, registerProviders } from '@volar/monaco';
import { VUE, INITIAL_CODE } from './constants';
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

    languages.onLanguage(VUE, setup);

};

const registerLanguages = () => {
    languages.register(
        {
            id: VUE,
            extensions: [`.${VUE}`]
        }
    );
};

const setupWorker = async() => {
    const worker = editor.createWebWorker<WorkerLanguageService>({
		moduleId: `vs/language/${VUE}/${VUE}Worker`,
		label: VUE
	});
    const getSyncUris = () => editor.getModels().map((model) => model.uri);
    activateMarkers(
		worker,
		[VUE],
		VUE,
		getSyncUris,
		editor
	);
    activateAutoInsertion(
		worker,
		[VUE],
		getSyncUris,
		editor
	);
    await registerProviders(
        worker,
        [VUE],
        getSyncUris,
        languages
    );
};

document.addEventListener('DOMContentLoaded', () => {

    setup();
    registerLanguages();

    const instance = editor.create(
    
        document.getElementById('editor') as HTMLElement,
        {
            theme: 'vs-dark',
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

    setupWorker()
        .then(() => {
            instance.setModel(
                editor.createModel(
                    INITIAL_CODE,
                    VUE,
                    Uri.parse('file:///main.vue')
                )
            );
        });

});



