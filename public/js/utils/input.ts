class Input{
    keyboard: Phaser.Keyboard;
    gamepad: Phaser.SinglePad;
    pointer: Phaser.Pointer;

    private aState: InputState = new InputState();
    private bState: InputState = new InputState();
    private previousInputState: InputState = this.bState;
    private currentInputState: InputState = this.aState;

    constructor(game: Phaser.Game){
        if (game.input.keyboard) this.keyboard = game.input.keyboard;
        if (game.input.gamepad && game.input.gamepad.supported && game.input.gamepad.active && game.input.gamepad.pad1) this.gamepad = game.input.gamepad.pad1;
        if (game.input.activePointer && game.input.activePointer.active && game.input.activePointer) this.pointer = game.input.activePointer;
    }

    isDown(type: InputType){
        return this.currentInputState[type];
    }

    isUp(type: InputType){
        return ! this.isDown(type);
    }

    isJustDown(type: InputType){
        return this.currentInputState[type] && ! this.previousInputState[type];
    }

    isJustUp(type: InputType){
        return ! this.currentInputState[type] && this.previousInputState[type];
    }

    update(){
        if (this.currentInputState == this.aState) {
            this.currentInputState = this.bState;
            this.previousInputState = this.aState;
        } else {
            this.currentInputState = this.aState;
            this.previousInputState = this.bState;
        }

        this.currentInputState.update(this.keyboard, this.gamepad, this.pointer);
    }
}

class InputState {
    update(keyboard: Phaser.Keyboard, gamepad: Phaser.SinglePad, pointer: Phaser.Pointer){
        this[InputType.UP] = (keyboard && (keyboard.isDown(Phaser.Keyboard.UP) || keyboard.isDown(Phaser.Keyboard.W))) || (gamepad && (gamepad.isDown(Phaser.Gamepad.PS3XC_DPAD_UP) || gamepad.isDown(Phaser.Gamepad.XBOX360_DPAD_UP)));
        this[InputType.DOWN] = (keyboard && (keyboard.isDown(Phaser.Keyboard.DOWN) || keyboard.isDown(Phaser.Keyboard.S))) || (gamepad && (gamepad.isDown(Phaser.Gamepad.PS3XC_DPAD_DOWN) || gamepad.isDown(Phaser.Gamepad.XBOX360_DPAD_DOWN)));
        this[InputType.LEFT] = (keyboard && (keyboard.isDown(Phaser.Keyboard.LEFT) || keyboard.isDown(Phaser.Keyboard.A))) || (gamepad && (gamepad.isDown(Phaser.Gamepad.PS3XC_DPAD_LEFT) || gamepad.isDown(Phaser.Gamepad.XBOX360_DPAD_LEFT)));
        this[InputType.RIGHT] = (keyboard && (keyboard.isDown(Phaser.Keyboard.RIGHT) || keyboard.isDown(Phaser.Keyboard.D))) || (gamepad && (gamepad.isDown(Phaser.Gamepad.PS3XC_DPAD_RIGHT) || gamepad.isDown(Phaser.Gamepad.XBOX360_DPAD_RIGHT)));
        this[InputType.ACTION] = (pointer && pointer.isDown) || (keyboard && (keyboard.isDown(Phaser.Keyboard.SPACEBAR) || keyboard.isDown(Phaser.Keyboard.ENTER)));
        this[InputType.DELETE] = keyboard && (keyboard.isDown(Phaser.Keyboard.BACKSPACE) || keyboard.isDown(Phaser.Keyboard.DELETE));
        this[InputType.ESCAPE] = keyboard && keyboard.isDown(Phaser.Keyboard.ESC);
        this[InputType.ENTER] = keyboard && keyboard.isDown(Phaser.Keyboard.ENTER);
        this[InputType.SPACE] = keyboard && keyboard.isDown(Phaser.Keyboard.SPACEBAR);
        this[InputType.CLICK] = pointer && pointer.isDown;
        this[InputType.SHIFT] = keyboard && keyboard.isDown(Phaser.Keyboard.SHIFT);
        this[InputType.PLUS] = keyboard && keyboard.isDown(Phaser.Keyboard.EQUALS);
        this[InputType.MINUS] = keyboard && keyboard.isDown(Phaser.Keyboard.UNDERSCORE);
        this[InputType.ARROW_UP] = keyboard && keyboard.isDown(Phaser.Keyboard.UP);
        this[InputType.ARROW_DOWN] = keyboard && keyboard.isDown(Phaser.Keyboard.DOWN);
        this[InputType.ARROW_LEFT] = keyboard && keyboard.isDown(Phaser.Keyboard.LEFT);
        this[InputType.ARROW_RIGHT] = keyboard && keyboard.isDown(Phaser.Keyboard.RIGHT);
        this[InputType.WASD_UP] = keyboard && keyboard.isDown(Phaser.Keyboard.W);
        this[InputType.WASD_DOWN] = keyboard && keyboard.isDown(Phaser.Keyboard.S);
        this[InputType.WASD_LEFT] = keyboard && keyboard.isDown(Phaser.Keyboard.A);
        this[InputType.WASD_RIGHT] = keyboard && keyboard.isDown(Phaser.Keyboard.D);
        this[InputType.LESS_THAN] = keyboard && keyboard.isDown(Phaser.Keyboard.COMMA);
        this[InputType.GREATER_THAN] = keyboard && keyboard.isDown(Phaser.Keyboard.PERIOD);
    }
}