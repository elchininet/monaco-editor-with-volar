import { editor, languages, Uri, Position } from 'monaco-editor-core';
import { LanguageService } from '@vue/language-service';
import * as volar from '@volar/monaco';
import { VUE, INITIAL_CODE } from './constants';
import { getOrCreateModel } from './utilities';
import './styles.scss';

let initialized = false;

const REG_STYLE = /^[\s\S]*?<style[^>]*>[\s\S]*?var\s*\(\s*--[\w-]*$/;

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
    const languagesIds = [VUE, 'css', 'javascript', 'typescript'];
    const getSyncUris = () => editor.getModels().map((model) => model.uri);
    volar.editor.activateMarkers(
		worker,
		languagesIds,
		VUE,
		getSyncUris,
		editor
	);
    volar.editor.activateAutoInsertion(
		worker,
		languagesIds,
		getSyncUris,
		editor
	);
    await volar.languages.registerProvides(
        worker,
        languagesIds,
        getSyncUris,
        languages
    );

    const VARS = {
        '--bui-color-1': '#FF0033',
        '--bui-palo-2': '20px'
    };

    languages.registerCompletionItemProvider('vue', {
        triggerCharacters: ['-'],
        provideCompletionItems(
            model: editor.ITextModel,
            position: Position
        ) {
            const textUntilPosition = model.getValueInRange({
                startLineNumber: 1,
                endLineNumber: position.lineNumber, 
                startColumn: 1,
                endColumn: position.column
            });
            if (REG_STYLE.test(textUntilPosition)) {
                const word = model.getWordUntilPosition(position);
                const range = {
                    startLineNumber: position.lineNumber,
                    endLineNumber: position.lineNumber,
                    startColumn: word.startColumn - 2,
                    endColumn: word.endColumn
                };
                const suggestions: languages.CompletionItem[] = Object.entries(VARS).map((entry) => {
                    const [name, value] = entry;
                    return {
                        label: {
                            label: name,
                            description: value
                        },
                        kind: languages.CompletionItemKind.Color,
                        insertText: name,
                        detail: value,
                        range
                    };
                });
                return {
                    suggestions,
                };
            }            
        }
    });

    getOrCreateModel(
        Uri.parse('file:///node_modules/@bookingcom/bui-vue/index.d.ts'),
        VUE,
        `
        import { DefineComponent } from 'vue';
        declare namespace Global {
            export type global = number[];
        }
        declare namespace BuiContainer {
            type Props = {
                centered?: boolean;
                variant?: 'vertical' | 'horizontal' | 'partial';
                parent?: Global.global;
            };
            type BuiContainer = DefineComponent<Props>;
            export default BuiContainer;
        }
        declare namespace BuiAlert {
            type Props = {
                error: boolean
            };
            type BuiAlert = DefineComponent<Props>;
            export default BuiAlert;
        }
        declare module 'vue' {
            export interface GlobalComponents {
                BuiContainer: BuiContainer.default,
                BuiAlert: BuiAlert.default;
            }
        }
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
        lightbulb: {
            enabled: editor.ShowLightbulbIconMode.Off
        }
    }
);