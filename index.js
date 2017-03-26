'use strict';

const HtmlDiffer = require('html-differ').HtmlDiffer;
const logger = require('html-differ/lib/logger');
const fs = require('fs');
const List = require('prompt-list');

const DIFF_OPTIONS = {
    ignoreAttributes: [],
    compareAttributesAsJSON: [],
    ignoreWhitespaces: true,
    ignoreComments: true,
    ignoreEndTags: false,
    ignoreDuplicateAttributes: false
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
        console.log();
        console.log(etalonPath);
        console.error('Эталонный файл различается');
        logger.logDiffText(diff);

        return new List({
                type: 'list',
                name: 'order',
                message: `Заменить эталонный файл ${etalonPath}?`,
                choices: [
                    'No',
                    'Yes'
                ]
            })
                .run()
                .then((answer) => {
                if (answer === 'Yes') {
                        console.log('Перезаписываем файл.');
                        fs.createReadStream(magicPath)
                            .pipe(fs.createWriteStream(etalonPath));
                        console.log('Успешно!');
                        return;
                    }
                    console.log('Не перезаписываем файл');
                })
                .catch((error) => {
                        throw Error(`Error: "${error}".`);
                });

        return Promise.resolve();
    }
};

module.exports = saveCompatesSuggest;
