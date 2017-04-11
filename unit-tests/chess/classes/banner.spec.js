'use strict';

(function() {
    describe('Banner', function() {
        var banner;
        beforeEach(angular.mock.module('myApp.classes'));
        beforeEach(inject(function (_Banner_) {
            banner = new _Banner_();
        }));
        it('Can change text', function(){
            var text = "hello";
            banner.changeText(text);
            expect(banner.text.text).toEqual(text);
        });
        it('Can change visibility', function(){
            banner.visible(true);
            expect(banner.background.visible).toBeTruthy();
            expect(banner.border.visible).toBeTruthy();
            expect(banner.text.visible).toBeTruthy();
            banner.visible(false);
            expect(banner.background.visible).toBeFalsy();
            expect(banner.border.visible).toBeFalsy();
            expect(banner.text.visible).toBeFalsy();
        });

        it('Adds all elements', function(){
            var stage = new createjs.Stage();
            spyOn(banner.container, "addChild");
            banner.addToStage(stage);
            expect(banner.container.addChild).toHaveBeenCalledTimes(3);
            expect(findChild(banner.container, stage)).toBeTruthy();
            function findChild(child, stage){
                var k;
                for(k = 0; k < stage.getNumChildren(); k++) {
                    if (stage.getChildAt(k) === child) {
                        return true;
                    }
                }
                return false;
            }
        });

    });
}());