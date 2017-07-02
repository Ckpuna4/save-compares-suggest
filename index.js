'use strict';

const HtmlDiffer = require('html-differ').HtmlDiffer;
const logger = require('html-differ/lib/logger');
const fs = require('fs');
const List = require('prompt-list');
const chalk = require('chalk');
const beautify = require('js-beautify').html;

const DIFF_OPTIONS = {
    ignoreAttributes: [],
    compareAttributesAsJSON: [],
    ignoreWhitespaces: true,
    ignoreComments: true,
    ignoreEndTags: false,
    ignoreDuplicateAttributes: false
};

const beautifyConfig = {
        'indent_char': '!',
        'indent_with_tabs': true,
        'end_with_newline': true,
        'preserve_newlines': true,
        'max_preserve_newlines': 1
};

/**
 * Метод сравнения файлов
 * @param {Object} options Опции
 * @param {String} options.etalonPath Путь до эталона
 * @param {String} options.magicPath Путь до шаблонизированного файла
 * @returns {Promise}
 */
const saveCompatesSuggest = (options) => {
    const htmlDiffer = new HtmlDiffer('bem', DIFF_OPTIONS);
    const etalonPath = options.etalonPath;
    const magicPath = options.magicPath;

    const etalonFile = fs.readFileSync(etalonPath, 'utf-8');
    const magicFile = fs.readFileSync(magicPath, 'utf-8');

    const diff = htmlDiffer.diffHtml(magicFile, etalonFile);
    const isEqual = htmlDiffer.isEqual(magicFile, etalonFile);


    if (!isEqual) {
        console.log();
        console.log();
        console.log(chalk.white.bold('  Attention!'));
        console.log(chalk.white(`    The etalon file ${chalk.white.bold(etalonPath)} has differences with actual html`));
        console.log();
        logger.logDiffText(diff);
        console.log();

        return new List({
                type: 'list',
                name: 'order',
                message: `Replace the etalon file ${etalonPath} with the actual result?`,
                choices: [
                    'No',
                    'Yes'
                ]
            })
                .run()
                .then((answer) => {
                    if (answer === 'Yes') {
                        console.log('Replacing..');
                        let tmp = '';
                        const stream = fs.createReadStream(magicPath);

                        stream.on('data', (buffer) => {
                            tmp += buffer.toString();
                        });

                        stream.on('end', () => {
                            const pretty = beautify(tmp, beautifyConfig);
                            fs.writeFile(etalonPath, pretty, 'utf-8');
                        });

                        console.log(chalk.black.bgGreen(' Success! '));
                        return;
                    }
                    console.log('No');
                })
                .catch((error) => {
                    throw Error(`Error: "${error}".`);
                });
    }
    return Promise.resolve();
};

module.exports = saveCompatesSuggest;
