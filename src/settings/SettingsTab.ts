import { App, PluginSettingTab, Setting } from "obsidian";
import TagHierarchyPlugin from "../main";

export interface TagHierarchySettings {
    displayInRightSidebar: boolean;
    expandedByDefault: boolean;
    showTagCount: boolean;
    minTagCount: number;
    generateMarkdownFile: boolean;
    markdownFilePath: string;
    updateOnStartup: boolean;
}

export const DEFAULT_SETTINGS: TagHierarchySettings = {
    displayInRightSidebar: true,
    expandedByDefault: false,
    showTagCount: true,
    minTagCount: 1,
    generateMarkdownFile: true,
    markdownFilePath: 'Vault Tag Hierarchy.md',
    updateOnStartup: true
};

export class TagHierarchySettingTab extends PluginSettingTab {
    plugin: TagHierarchyPlugin;

    constructor(app: App, plugin: TagHierarchyPlugin) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display(): void {
        const {containerEl} = this;
        containerEl.empty();

        containerEl.createEl('h2', {text: 'Tag Hierarchy Settings'});

        new Setting(containerEl)
            .setName('Display in right sidebar')
            .setDesc('Automatically display the tag hierarchy in the right sidebar when Obsidian starts')
            .addToggle(toggle => toggle
                .setValue(this.plugin.settings.displayInRightSidebar)
                .onChange(async (value) => {
                    this.plugin.settings.displayInRightSidebar = value;
                    await this.plugin.saveSettings();
                }));

        new Setting(containerEl)
            .setName('Expand all by default')
            .setDesc('Expand all tag hierarchies by default')
            .addToggle(toggle => toggle
                .setValue(this.plugin.settings.expandedByDefault)
                .onChange(async (value) => {
                    this.plugin.settings.expandedByDefault = value;
                    await this.plugin.saveSettings();
                }));

        new Setting(containerEl)
            .setName('Show tag count')
            .setDesc('Show the number of notes for each tag')
            .addToggle(toggle => toggle
                .setValue(this.plugin.settings.showTagCount)
                .onChange(async (value) => {
                    this.plugin.settings.showTagCount = value;
                    await this.plugin.saveSettings();
                }));

        new Setting(containerEl)
            .setName('Minimum tag count')
            .setDesc('Only show tags that appear in at least this many notes')
            .addSlider(slider => slider
                .setLimits(1, 10, 1)
                .setValue(this.plugin.settings.minTagCount)
                .setDynamicTooltip()
                .onChange(async (value) => {
                    this.plugin.settings.minTagCount = value;
                    await this.plugin.saveSettings();
                }));

        new Setting(containerEl)
            .setName('Generate markdown file')
            .setDesc('Generate a markdown file with the tag hierarchy')
            .addToggle(toggle => toggle
                .setValue(this.plugin.settings.generateMarkdownFile)
                .onChange(async (value) => {
                    this.plugin.settings.generateMarkdownFile = value;
                    await this.plugin.saveSettings();
                }));

        new Setting(containerEl)
            .setName('Markdown file path')
            .setDesc('Path to the markdown file (relative to vault root)')
            .addText(text => text
                .setPlaceholder('Vault Tag Hierarchy.md')
                .setValue(this.plugin.settings.markdownFilePath)
                .onChange(async (value) => {
                    this.plugin.settings.markdownFilePath = value || 'Vault Tag Hierarchy.md';
                    await this.plugin.saveSettings();
                }));

        new Setting(containerEl)
            .setName('Update on startup')
            .setDesc('Update the markdown file when Obsidian starts')
            .addToggle(toggle => toggle
                .setValue(this.plugin.settings.updateOnStartup)
                .onChange(async (value) => {
                    this.plugin.settings.updateOnStartup = value;
                    await this.plugin.saveSettings();
                }));


        new Setting(containerEl)
            .setName('Generate markdown file now')
            .setDesc('Manually generate the markdown file with the current settings')
            .addButton(button => button
                .setButtonText('Generate')
                .onClick(async () => {
                    this.plugin.app.workspace.trigger('obsidian-tag-hierarchy:generate-tag-hierarchy-markdown');
                }));
    }
}
