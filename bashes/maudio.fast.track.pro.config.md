# M-Audio Fast Track Pro
__Source:__ https://wiki.archlinux.org/index.php/Professional_audio#M-Audio_Fast_Track_Pro

The M-Audio Fast Track Pro is an USB 4x4 audio interface, working at 24bit/96kHz. Due to limitation of USB 1, this device requires additional setup to get access to all its features. Device works in one of two configuration:

* Configuration 1, or "Class compliant mode" - with reduced functionality, only 16bit, 48kHz, analogue input (2 channels) and digital/analogue output (4 channels).
* Configuration 2 - with access to all features of interface.
Currently with stock kernel it runs in configuration 2, but if you want to make sure in what mode you are, you can check kernel log for entries:

```
usb-audio: Fast Track Pro switching to config #2
usb-audio: Fast Track Pro config OK
```

The interface also needs extra step of cofiguration to switch modes. It is done using option `device_setup` during module loading. The recommended way to setup the interface is using file in `modprobe.d`:

```
/etc/modprobe.d/ftp.conf
options snd_usb_audio vid=0x763 pid=0x2012 device_setup=XXX index=YYY enable=1
```

where `vid` and `pid` are vendor and product id for M-Audio Fast Track Pro, `index` is desired device number and `device_setup` is desired device setup. Possible values for `device_setup` are:

### device modes
device_setup value | bit depth | frequency | analog output | digital output | analog input | digital input | IO mode
--- | --- | --- | --- | --- | --- | --- | ---
0x0 | 16 bit |  48kHz | + | + | + | + | 4x4
0x9 | 24 bit | 48kHz | + | + | + | - | 2x4
0x13 | 24 bit | 48kHz | + | + | - | + | 2x4
0x5 | 24 bit | 96kHz | * | * | * | * | 2x0 or 0x2

The 24 bit/96kHz mode is special: it provides all input/output, but you can open only one of 4 interfaces at a time. If you for example open output interface and then try to open second output or input interface, you will see error in kernel log:

```
cannot submit datapipe for urb 0, error -28: not enough bandwidth
```
which is perfectly normal, because this is USB 1 device and cannot provide enough bandwidth to support more than single (2 channel) destination/source of that quality at a time.

Depending on the value of `index` it will setup two devices: `hwYYY:0` and `hwYYY:1`, which will contain available inputs and outputs. First device is most likely to contain analog output and digital input, while second one will contain analog input and digital output. To find out which devices are linked where and if they are setup correctly, you can check `/proc/asound/cardYYY/stream{0,1}`. Below is list of important endpoints that will help in correctly identifying card connections (it easy to mistake analog and digital input or output connections before you get used to the device):

```
EP 3 (analgoue output = TRS on back, mirrored on RCA outputs 1 and 2 on back)
EP 4 (digital output = S/PDIF output on back, mirrored on RCA outputs 3 and 4 on back)
EP 5 (analogue input = balanced TRS or XLR microphone, unbalanced TS line on front)
EP 6 (digital input = S/PDIF input on back)
```

This .asoundrc file enables 24-bit IO on the fast-track pro (and I'm sure it could be modified to work with other 3-byte usb devices) within the context of jack's 32-bit interface while routing default alsa traffic to jack outputs on the audio interface. Alsa will be in S24_3BE mode but jack can plug S32_LE data in and out of the interface and other alsa programs will be able to plug almost anything into jack.

```
### ~/.asoundrc
### default alsa config file, for a fast-track pro configured in 24-bit mode as so:
### options snd_usb_audio device_setup=0x9
### invoke jack with: (if you use -r48000, change the rate in the plugs as well)
### $jackd -dalsa -P"hw:Pro" -C"hw:Pro,1" -r44100

## setup input and output plugs so jack can write S24_3BE data to the audio interface

pcm.maud0 {
	type hw
	card Pro
	 }

#jack_out plug makes sure that S32_LE data can be written to hw:Pro
pcm.jack_out{
	type plug
	format S32_LE
	channels 2
	rate 44100
	slave pcm.maud0
}

pcm.maud1 {
	type hw
	card Pro
	device 1
}
## jack_in plug makes sure that hw:Pro,1 can read S32_LE data
pcm.jack_in {
	type plug
	format S32_LE
	channels 2
	rate 44100
	slave pcm.maud1
}
#####
# route default alsa traffic through jack system io

pcm.jack {
    type jack
    playback_ports {
        0 system:playback_1
        1 system:playback_2
    }
    capture_ports {
        0 system:capture_1
        1 system:capture_2
    }
} 
pcm.amix {
	type asym
	playback.pcm "jack"
	capture.pcm "jack"
	}
pcm.!default {
	type plug
	slave.pcm amix
}
```

