/**
 * FastText.js
 * @author Loreto Parisi (loretoparisi at gmail dot com)
 * @copyright Copyright (c) 2017 Loreto Parisi
*/

(function() {

var resolve = require('path').resolve
    
var Util = {

    GetBinFolder : function() {
        var cdir=process.cwd();
        var pathComponents=__dirname.split('/');
        var root=pathComponents.slice(0,pathComponents.length-1).join('/');
        process.chdir(root);
        var binpath=resolve('./lib/bin/'+ process.platform + '/fasttext');
        process.chdir(cdir);
        return binpath;
    },

    /**
     * Get temporary folder path
     * Supported platforms: Windows, Linux, MacOS
     */
    GetTempDir : function() {
        var path;

        var isWindows = process.platform === 'win32';
        var trailingSlashRe = isWindows ? /[^:]\\$/ : /.\/$/;
        
        if (isWindows) {
            path = process.env.TEMP ||
                process.env.TMP ||
                (process.env.SystemRoot || process.env.windir) + '\\temp';
        } else {
            path = process.env.TMPDIR ||
                process.env.TMP ||
                process.env.TEMP ||
                '/tmp';
        }

        if (trailingSlashRe.test(path)) {
            path = path.slice(0, -1);
        }

        return path;
    },//GetTempDir

    /*
    * Recursively merge properties of two objects 
    * @todo: moved to Util
    */
    MergeRecursive: function(obj1, obj2) {
        for (var p in obj2) {
            try {
            // Property in destination object set; update its value.
            if ( obj2[p].constructor==Object ) {
                obj1[p] = this.mergeRecursive(obj1[p], obj2[p]);

            } else {
                obj1[p] = obj2[p];

            }

            } catch(e) {
            // Property in destination object not set; create it and set its value.
            obj1[p] = obj2[p];

            }
        }
        return obj1;
    }//mergeRecursive

}//Util

module.exports = Util;

}).call(this);