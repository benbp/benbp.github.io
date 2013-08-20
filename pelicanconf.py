#!/usr/bin/env python
# -*- coding: utf-8 -*- #
from __future__ import unicode_literals

AUTHOR = u'Ben Broderick Phillips'
SITENAME = u"Ben Broderick Phillips"
#SITEURL = 'http://benbp.net'
SITEURL = ''

TIMEZONE = 'America/Los_Angeles'
DEFAULT_LANG = u'en'

GOOGLE_ANALYTICS = 'UA-37252281-1'

#THEME='themes/pelican-svbtle'
#THEME='themes/pelican-mockingbird'
#THEME='themes/pelican-mockingbird-fork'
THEME='themes/tuxlite_tbs'

# Feed generation is usually not desired when developing
#FEED_ALL_ATOM = None
#CATEGORY_FEED_ATOM = None
#TRANSLATION_FEED_ATOM = None
#FEED_RSS = 'feeds/all.rss.xml'
#CATEGORY_FEED_RSS = 'feeds/%s.rss.xml'

# static paths will be copied under the same name
STATIC_PATHS = ['images', 'pdfs', 'fonts',]

# Links widget
LINKS =  (
             ('Github', 'http://github.com/benbp/'),
             ('LinkedIn', 'http://linkedin.com/in/benbp'),
             ('Email', 'mailto:ben@benbp.net'),
         )

CREDITS = 'pages/credits.html'

DEFAULT_PAGINATION = False
DISPLAY_PAGES_ON_MENU = True
# Use filesystem dates if none are specified
FALLBACK_ON_FS_DATE = True

# Uncomment following line if you want document-relative URLs when developing
#RELATIVE_URLS = True
