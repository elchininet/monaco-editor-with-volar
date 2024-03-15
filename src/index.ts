import { editor, languages, Uri } from 'monaco-editor-core';
import { LanguageService } from '@volar/language-service';
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

    const worker = editor.createWebWorker<LanguageService>({
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

