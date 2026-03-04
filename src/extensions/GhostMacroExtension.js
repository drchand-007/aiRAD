import { Extension } from '@tiptap/core';
import { Plugin, PluginKey } from '@tiptap/pm/state';
import { Decoration, DecorationSet } from '@tiptap/pm/view';

export const GhostMacroPluginKey = new PluginKey('ghostMacro');

export const GhostMacroExtension = Extension.create({
    name: 'ghostMacro',

    addOptions() {
        return {
            getMacros: () => [], // Function returning array of { command: string, text: string }
        };
    },

    addProseMirrorPlugins() {
        const { options, editor } = this;

        return [
            new Plugin({
                key: GhostMacroPluginKey,
                state: {
                    init() {
                        return DecorationSet.empty;
                    },
                    apply(tr, oldState) {
                        // Only update on document changes or selection changes
                        if (!tr.docChanged && !tr.selectionSet) {
                            // But if macros changed, we might need a force update. Let's just recompute for safety if mapping is hard, but mapping is better.
                            return oldState.map(tr.mapping, tr.doc);
                        }

                        const { selection } = tr;
                        if (!selection.empty) {
                            return DecorationSet.empty;
                        }

                        const $cursor = selection.$from;
                        // Get the text node before the cursor
                        const textBefore = $cursor.parent.textContent.substring(0, $cursor.parentOffset);

                        if (!textBefore || textBefore.trim() === '') {
                            return DecorationSet.empty;
                        }

                        // Simple matching: Is the immediately preceding word(s) a macro command?
                        // To support multi-word macros (e.g., "normal abdomen"), we check if textBefore ends with any macro command.
                        let matchedMacro = null;
                        let matchedCommandLength = 0;

                        const currentMacros = options.getMacros();
                        const sortedMacros = [...currentMacros].sort((a, b) => b.command.length - a.command.length);

                        for (const macro of sortedMacros) {
                            const cmd = macro.command.toLowerCase();
                            if (textBefore.toLowerCase().endsWith(cmd)) {
                                // Ensure it's a word boundary before the command, or it's the start of the text
                                const preText = textBefore.substring(0, textBefore.length - cmd.length);
                                if (preText === '' || preText.endsWith(' ') || preText.endsWith('\n') || preText.endsWith('>')) {
                                    matchedMacro = macro;
                                    matchedCommandLength = cmd.length;
                                    break;
                                }
                            }
                        }

                        if (matchedMacro) {
                            const deco = Decoration.widget($cursor.pos, () => {
                                const widget = document.createElement('span');
                                widget.className = 'opacity-40 italic bg-muted/40 text-muted-foreground pointer-events-none px-1 rounded mx-0.5 select-none transition-opacity duration-200';

                                const tempDiv = document.createElement('div');
                                tempDiv.innerHTML = matchedMacro.text;
                                const plainTextPreview = tempDiv.textContent || tempDiv.innerText || "";

                                const previewLength = 40;
                                const displayPreview = plainTextPreview.length > previewLength
                                    ? plainTextPreview.substring(0, previewLength) + '...'
                                    : plainTextPreview;

                                widget.innerHTML = `<kbd class="text-[10px] uppercase font-sans border border-muted-foreground/40 rounded px-1 mr-1 align-middle bg-muted/50">Tab</kbd>${displayPreview}`;
                                return widget;
                            }, {
                                side: 1, // Draw after the cursor
                                key: 'ghost-macro-preview',
                                macro: matchedMacro, // attach data for the keydown handler
                                cmdLength: matchedCommandLength
                            });
                            return DecorationSet.create(tr.doc, [deco]);
                        }

                        return DecorationSet.empty;
                    },
                },
                props: {
                    decorations(state) {
                        return this.getState(state);
                    },
                    handleKeyDown(view, event) {
                        // When user hits Tab, check if we have a ghost text decoration active
                        if (event.key === 'Tab') {
                            const pluginState = this.getState(view.state);
                            if (pluginState && pluginState !== DecorationSet.empty) {
                                const decos = pluginState.find(view.state.selection.from, view.state.selection.from);
                                if (decos.length > 0) {
                                    const deco = decos[0];
                                    if (deco.spec.macro) {
                                        event.preventDefault(); // Stop default tab behavior

                                        const macroText = deco.spec.macro.text;
                                        const commandLength = deco.spec.cmdLength;
                                        const pos = view.state.selection.from;

                                        // Replace the typed command with the macro text
                                        const tr = view.state.tr.delete(pos - commandLength, pos);
                                        view.dispatch(tr);

                                        // Now insert the macro content (which could be HTML)
                                        editor.commands.insertContentAt(pos - commandLength, macroText);
                                        return true;
                                    }
                                }
                            }
                        }
                        return false;
                    },
                },
            }),
        ];
    },
});
