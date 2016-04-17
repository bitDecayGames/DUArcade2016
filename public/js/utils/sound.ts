class SoundUtil {
    static AUDIO_ENABLED = false;

    static playSound(game: Phaser.Game, soundName: string) {
        if (SoundUtil.AUDIO_ENABLED) {
            game.sound.play(soundName);
        }
    }
}