# !/usr/bin/python
# -*-coding:utf-8 -*-

import time,sys

import smbus
import RPi.GPIO as GPIO

class lcd :
    def __init__(self):
        self.rev = 2
        if self.rev == 2 or self.rev == 3:
            self.bus = smbus.SMBus(1)
        else:
            self.bus = smbus.SMBus(0)
 
        # this device has two I2C addresses
        self.DISPLAY_RGB_ADDR = 0x62
        self.DISPLAY_TEXT_ADDR = 0x3e
 
    # set backlight to (R,G,B) (values from 0..255 for each)
    def setRGB(self, r,g,b):
        self.bus.write_byte_data(self.DISPLAY_RGB_ADDR,0,0)
        self.bus.write_byte_data(self.DISPLAY_RGB_ADDR,1,0)
        self.bus.write_byte_data(self.DISPLAY_RGB_ADDR,0x08,0xaa)
        self.bus.write_byte_data(self.DISPLAY_RGB_ADDR,4,r)
        self.bus.write_byte_data(self.DISPLAY_RGB_ADDR,3,g)
        self.bus.write_byte_data(self.DISPLAY_RGB_ADDR,2,b)
    
    # send command to display (no need for external use)    
    def textCommand(self, cmd):
        self.bus.write_byte_data(self.DISPLAY_TEXT_ADDR,0x80,cmd)
 
    # set display text \n for second line(or auto wrap)     
    def setText(self, text):
        self.textCommand(0x01) # clear display
        time.sleep(.05)
        self.textCommand(0x08 | 0x04) # display on, no cursor
        self.textCommand(0x28) # 2 lines
        time.sleep(.05)
        count = 0
        row = 0
        for i, c in enumerate(text):
            if c == '\n' or count == 16:
                count = 0
                row += 1
                if row == 2:
                    break
                self.textCommand(0xc0)
                if c == '\n':
                    continue
            count += 1
            self.bus.write_byte_data(self.DISPLAY_TEXT_ADDR,0x40,ord(c))

    def setText_top(self, text):
        self.textCommand(0x02) # return home
        time.sleep(.05)
        self.textCommand(0x08 | 0x04) # display on, no cursor
        self.textCommand(0x28) # 2 lines
        time.sleep(.05)
        count = 0
        row = 0
        for i, c in enumerate(text):
            if c == '\n' or count == 16:
                break
            self.bus.write_byte_data(self.DISPLAY_TEXT_ADDR,0x40,ord(c))
    
    def setText_bottom(self, text):
        self.textCommand(0x02) # return home
        time.sleep(.05)
        self.textCommand(0x08 | 0x04) # display on, no cursor
        self.textCommand(0x28) # 2 lines
        time.sleep(.05)
        self.textCommand(0xc0) # skip
        count = 0
        row = 0
        for i, c in enumerate(text):
            if c == '\n' or count == 16:
                self.textCommand(0x02)
                break
            self.bus.write_byte_data(self.DISPLAY_TEXT_ADDR,0x40,ord(c))
 
    #Update the display without erasing the display
    def setText_norefresh(self, text):
        self.textCommand(0x02) # return home
        time.sleep(.05)
        self.textCommand(0x08 | 0x04) # display on, no cursor
        self.textCommand(0x28) # 2 lines
        time.sleep(.05)
        count = 0
        row = 0
        while len(text) < 32: #clears the rest of the screen
            text += ' '
        for c in text:
            if c == '\n' or count == 16:
                count = 0
                row += 1
                if row == 2:
                    break
                self.textCommand(0xc0)
                if c == '\n':
                    continue
            count += 1
            self.bus.write_byte_data(self.DISPLAY_TEXT_ADDR,0x40,ord(c))
    
    def clean_text(self, text):
        lowercase = 'abcdefghijklmnopqrstuvwxyz'
        uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
        digits = '0123456789'
        punctuation = '!"#$%&\'()*+,-./:;<=>?@[\\]^_`{|}~'
        whitespace = ' \t\n\r\x0b\x0c'
        allowed = [lowercase, uppercase, digits, punctuation, whitespace]
        cleaned_text = ""
        for c in text :
            for case in allowed :
                if c in case:
                    cleaned_text = cleaned_text + c
        return cleaned_text


# example code
if __name__=="__main__":
    lcd_controller = lcd()
    # lcd_controller.setText("Fuck world\nThis is an LCD testeasfwaawf\nawfwafaw\nafgewfa\n")
    lcd_controller.setRGB(255,255,255)
    #lcd_controller.setText("BTC:43000.12\nJohnnyChen:This comment is too damn long")
    #lcd_controller.setText("\n")
    # time.sleep(2)
    # for c in range(0,5):
    #     lcd_controller.setText_norefresh("Going to sleep in {}...".format(str(c)))
    #     lcd_controller.setRGB(c,255-c,0)
    #     time.sleep(0.1)
    # lcd_controller.setRGB(0,255,0)
    #
    framebuffer = ['Hello!', '',]
    long_string = "BTC:43000.12JohnnyChen:This comment is too damn long"
    """for i in range(len(long_string) - 16 + 1):
        framebuffer[1] = long_string[i:i+16]
        lcd_controller.setText_norefresh(framebuffer[0] + "\n" + framebuffer[1])
        time.sleep(0.05)"""
    lcd_controller.setText("BTC:43000.12\nJohnnyChen:This comment is too damn long")
    lcd_controller.setText_top(" "*16)
    lcd_controller.setText_top("helleeeeee")
    lcd_controller.setText_bottom(" "*16)
    lcd_controller.setText_bottom("2222222222222")
    lcd_controller.setText_top(" "*16)
    lcd_controller.setText_top("h3e")
    lcd_controller.setText_bottom(" "*16)
    lcd_controller.setText_bottom("ABCDEFGHIJKLMNOPQRSTUVWXYZ")
    lower_text = "This does not work as expected at least on python 3.7"
    #lower_text = "ABCDEFGHIJKLMNOPQRSTUVWXYZABCDEFGHIJKLMNOPQRSTUVWXYZ"
    framebuffer = ["", lower_text]
    #lcd_controller.setText_bottom(lower_text)
    for i in range(len(lower_text) - 16 + 1):
        framebuffer[1] = lower_text[i:i+16]
        lcd_controller.setText_bottom(framebuffer[1])
        time.sleep(0.2)