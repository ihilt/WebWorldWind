/*
 * Copyright 2015-2017 WorldWind Contributors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * @exports SlippyImageLayer
 */
define([
        '../geom/Angle',
        '../util/Color',
        '../geom/Location',
        '../geom/Sector',
        '../layer/MercatorTiledImageLayer'
    ],
    function (Angle,
              Color,
              Location,
              Sector,
              MercatorTiledImageLayer) {
        "use strict";

        /**
         * Constructs a map layer using Slippy tiles.
         * @alias SlippyImageLayer
         * @constructor
         * @augments MercatorTiledImageLayer
         * @classdesc Provides a layer that shows Slippy map imagery.
         *
         * @param {String} displayName This layer's display name. "Slippy Map" if this parameter is
         * null or undefined.
         * @param {String} baseUrl The base url specifying the host to pull tiles from. If not specified, defaults to
         * https://a.tile.openstreetmap.org/.
         * @param {String} numLevels The number of levels this Slippy tile provider supports (i.e. the maximum Z value
         * in a XYZ URL).
         */
        var SlippyImageLayer = function (displayName, baseUrl, numLevels) {
            baseUrl = baseUrl || "https://a.tile.openstreetmap.org/";
            this.imageSize = 256;
            displayName = displayName || "Slippy Map";
            numLevels = numLevels || 19;

            MercatorTiledImageLayer.call(this,
                new Sector(-85.05, 85.05, -180, 180), new Location(85.05, 180), numLevels, "image/png", displayName,
                this.imageSize, this.imageSize);

            this.displayName = displayName;
            this.pickEnabled = false;

            // Create a canvas we can use when unprojecting retrieved images.
            this.destCanvas = document.createElement("canvas");
            this.destContext = this.destCanvas.getContext("2d");

            this.urlBuilder = {
                urlForTile: function (tile, imageFormat) {
                    return baseUrl +
                        (tile.level.levelNumber + 1) + "/" + tile.column + "/" + tile.row + ".png";
                }
            };
        };

        SlippyImageLayer.prototype = Object.create(MercatorTiledImageLayer.prototype);

        SlippyImageLayer.prototype.doRender = function (dc) {
            MercatorTiledImageLayer.prototype.doRender.call(this, dc);
        };

        // Overridden from TiledImageLayer.
        SlippyImageLayer.prototype.createTopLevelTiles = function (dc) {
            this.topLevelTiles = [];

            this.topLevelTiles.push(this.createTile(null, this.levels.firstLevel(), 0, 0));
            this.topLevelTiles.push(this.createTile(null, this.levels.firstLevel(), 0, 1));
            this.topLevelTiles.push(this.createTile(null, this.levels.firstLevel(), 1, 0));
            this.topLevelTiles.push(this.createTile(null, this.levels.firstLevel(), 1, 1));
        };

        // Determines the Bing map size for a specified level number.
        SlippyImageLayer.prototype.mapSizeForLevel = function (levelNumber) {
            return 256 << (levelNumber + 1);
        };

        return SlippyImageLayer;
    }
)
;