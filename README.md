# Obsidian Tag Hierarchy Plugin

This plugin for [Obsidian](https://obsidian.md) visualizes and helps you navigate through hierarchical tags in your vault.

## Features

- Displays tags in a hierarchical tree structure
- Shows the count of notes for each tag
- Allows filtering tags by minimum usage count
- Clicking on a tag searches for notes with that tag
- Expandable/collapsible tag hierarchy levels
- Option to automatically display in the right sidebar
- Generates a markdown file with the tag hierarchy
- Automatically updates the markdown file on startup
- Command to manually update the markdown file

## First time developing plugins?

Quick starting guide for new plugin devs:

- Check if [someone already developed a plugin for what you want](https://obsidian.md/plugins)! There might be an existing plugin similar enough that you can partner up with.
- Make a copy of this repo as a template with the "Use this template" button (login to GitHub if you don't see it).
- Clone your repo to a local development folder. For convenience, you can place this folder in your `.obsidian/plugins/your-plugin-name` folder.
- Install NodeJS, then run `npm i` in the command line under your repo folder.
- Run `npm run dev` to compile your plugin from `main.ts` to `main.js`.
- Make changes to `main.ts` (or create new `.ts` files). Those changes should be automatically compiled into `main.js`.
- Reload Obsidian to load the new version of your plugin.
- Enable plugin in settings window.
- For updates to the Obsidian API run `npm update` in the command line under your repo folder.

## Releasing new releases

- Update your `manifest.json` with your new version number, such as `1.0.1`, and the minimum Obsidian version required for your latest release.
- Update your `versions.json` file with `"new-plugin-version": "minimum-obsidian-version"` so older versions of Obsidian can download an older version of your plugin that's compatible.
- Create new GitHub release using your new version number as the "Tag version". Use the exact version number, don't include a prefix `v`. See here for an example: https://github.com/obsidianmd/obsidian-sample-plugin/releases
- Upload the files `manifest.json`, `main.js`, `styles.css` as binary attachments. Note: The manifest.json file must be in two places, first the root path of your repository and also in the release.
- Publish the release.

> You can simplify the version bump process by running `npm version patch`, `npm version minor` or `npm version major` after updating `minAppVersion` manually in `manifest.json`.
> The command will bump version in `manifest.json` and `package.json`, and add the entry for the new version to `versions.json`

## Adding your plugin to the community plugin list

- Check the [plugin guidelines](https://docs.obsidian.md/Plugins/Releasing/Plugin+guidelines).
- Publish an initial version.
- Make sure you have a `README.md` file in the root of your repo.
- Make a pull request at https://github.com/obsidianmd/obsidian-releases to add your plugin.

## How to use

### Installation

- Download the latest release from the GitHub releases page
- Extract the zip file to your vault's plugins folder: `VaultFolder/.obsidian/plugins/obsidian-tag-hierarchy/`
- Enable the plugin in Obsidian's Community Plugins settings

### Using the Plugin

- Click the hashtag icon in the left ribbon to open the Tag Hierarchy view
- The view displays all tags in your vault in a hierarchical tree structure
- Click on a tag to search for notes with that tag
- Use the expand/collapse buttons to navigate through the hierarchy

### Available Commands

The plugin adds the following commands to the Obsidian command palette:

1. **Tag Hierarchy: Open Tag Hierarchy View**
   - Opens the tag hierarchy view in the right sidebar
   - Shows the hierarchical structure of all tags in your vault

2. **Tag Hierarchy: Refresh Tag Hierarchy**
   - Refreshes the tag hierarchy view with the latest tags from your vault
   - Useful after adding or modifying tags in your notes

3. **Tag Hierarchy: Generate Tag Hierarchy Markdown File**
   - Creates or updates the "Vault Tag Hierarchy.md" file at the root of your vault
   - The file contains a hierarchical listing of all tags with their counts
   - This command can be used at any time to manually update the markdown file

### Markdown File Generation

The plugin can generate a markdown file with your tag hierarchy:

- By default, a file named "Vault Tag Hierarchy.md" is created at the root of your vault
- The file is automatically updated when Obsidian starts (if enabled in settings)
- You can manually update the file using the "Generate Tag Hierarchy Markdown File" command
- The file shows all tags in a hierarchical structure with their counts
- You can customize the file path and other settings in the plugin settings

### Plugin Settings

- **View Settings**
  - Display in right sidebar: Automatically show the tag hierarchy in the right sidebar on startup
  - Expand all by default: Show all tag hierarchies expanded
  - Show tag count: Display the number of notes for each tag
  - Minimum tag count: Only show tags that appear in at least this many notes

- **Markdown File Settings**
  - Generate markdown file: Enable/disable the markdown file generation
  - Markdown file path: Set the path for the markdown file (relative to vault root)
  - Update on startup: Automatically update the markdown file when Obsidian starts

## Manually installing the plugin

- Copy over `main.js`, `styles.css`, `manifest.json` to your vault `VaultFolder/.obsidian/plugins/your-plugin-id/`.

## Improve code quality with eslint (optional)
- [ESLint](https://eslint.org/) is a tool that analyzes your code to quickly find problems. You can run ESLint against your plugin to find common bugs and ways to improve your code.
- To use eslint with this project, make sure to install eslint from terminal:
  - `npm install -g eslint`
- To use eslint to analyze this project use this command:
  - `eslint main.ts`
  - eslint will then create a report with suggestions for code improvement by file and line number.
- If your source code is in a folder, such as `src`, you can use eslint with this command to analyze all files in that folder:
  - `eslint .\src\`

## Funding URL

You can include funding URLs where people who use your plugin can financially support it.

The simple way is to set the `fundingUrl` field to your link in your `manifest.json` file:

```json
{
    "fundingUrl": "https://buymeacoffee.com"
}
```

If you have multiple URLs, you can also do:

```json
{
    "fundingUrl": {
        "Buy Me a Coffee": "https://buymeacoffee.com",
        "GitHub Sponsor": "https://github.com/sponsors",
        "Patreon": "https://www.patreon.com/"
    }
}
```

## API Documentation

See https://github.com/obsidianmd/obsidian-api
