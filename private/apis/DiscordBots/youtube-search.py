import sys
import re
from urllib import parse, request

if(len(sys.argv) == 2):

    q = sys.argv[1]

    sQuery = parse.urlencode({ 'search_query': q })
    html = request.urlopen('http://www.youtube.com/results?' + sQuery)

    sWatch = r"watch\?v=(\S{11})"
    dHtml = html.read().decode()

    res = re.findall(sWatch, dHtml)
    url = ("http://www.youtube.com/watch?v=" + res[0])

    print(url)

else:
    print('https://www.youtube.com/watch?v=KOJaHC3eEbc')

sys.stdout.flush()