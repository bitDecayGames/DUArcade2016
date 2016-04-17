class Json {
    static serializeSprite(s:Phaser.Sprite) {
        return {
            img: s.key,
            x: s.x,
            y: s.y,
            w: s.width,
            h: s.height
        };
    }

    static deSerializeSprite(game:Phaser.Game, json):Phaser.Sprite {
        var s:Phaser.Sprite = game.add.sprite(json.x, json.y, json.img);
        s.width = json.w;
        s.height = json.h;
        return s;
    }

    static serializePoint(p:Phaser.Point) {
        return {
            x: p.x,
            y: p.y
        };
    }

    static deSerializePoint(json):Phaser.Point {
        return new Phaser.Point(
            json.x,
            json.y);
    }

    static serializeRect(r:Phaser.Rectangle) {
        return {
            x: r.x,
            y: r.y,
            w: r.width,
            h: r.height
        };
    }

    static deSerializeRect(json):Phaser.Rectangle {
        return new Phaser.Rectangle(
            json.x,
            json.y,
            json.width,
            json.height
        );
    }
}