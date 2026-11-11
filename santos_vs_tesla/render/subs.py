import json,re
TL=json.load(open('timeline.json'))
SCRIPT={
1:"Dois gênios. Dois egos. Zero educação. Santos Dumont contra Nikola Tesla. Valendo!",
2:"Ô Tesla, seu sérvio magrelo do caralho! Fica aí brincando de raio igual criança com tomada! Eu voei, porra! Em Paris! Com o povo todo olhando! E você? Fez umas faíscas e acha que é Deus?",
3:"Voou? Voou?! Aquela merda de 14-Bis parecia uma pipa feita de caixa de sapato! Voou 60 metros, caralho! Minha bobina solta raio maior que esse teu voo de galinha!",
4:"Pelo menos eu terminei minhas coisas, seu enrolão! Cadê tua torre de energia grátis, hein? Ficou pela metade porque tu ficou sem grana, seu falido do cacete!",
5:"Falido, mas genial, seu baixinho de chapéu torto! Tu tinha que subir num banquinho pra entrar no próprio avião! E esse relógio de pulso aí? Pediu pro Cartier porque nem sabia ver as horas sozinho, né, desgraçado?",
6:"Baixinho é o caralho! Eu sou pequeno, mas sou leve, por isso eu voo! Tu é alto, esquisito e conversava com pombo, porra! Pombo, Tesla! Tua única amiga era uma pomba!",
7:"Não fala da minha pomba, seu filho da puta!",
8:"Ihhh, ficou nervosinho! Vai lá carregar teu celular de pombo, vai!",
9:"Celular que só existe por causa de mim, seu ingrato! Tua casa tem luz por minha causa, porra! Toda vez que tu acende uma lâmpada, tu me deve uma!",
10:"E toda vez que tu pega um avião, tu me deve a passagem, seu caloteiro!",
12:"E aí? Quem ganhou essa porradaria? Comenta avião pro Santos Dumont ou raio pro Tesla!"}
COL={'S':'&H0000E5FF&','T':'&H00FFC84A&','N':'&H00FFFFFF&'}   # BGR: yellow, electric blue, white
NAME={'S':'SANTOS DUMONT','T':'NIKOLA TESLA','N':'NARRADOR'}
def ts(t):
    h=int(t//3600); m=int(t%3600//60); s=t%60
    return f"{h}:{m:02d}:{s:05.2f}"
out=["[Script Info]","ScriptType: v4.00+","PlayResX: 1080","PlayResY: 1920","WrapStyle: 2","",
"[V4+ Styles]","Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding",
"Style: Cap,Inter ExtraBold,92,&H00FFFFFF,&H00FFFFFF,&H00000000,&H96000000,1,0,0,0,100,100,0,0,1,7,4,5,60,60,0,1",
"Style: Name,Inter ExtraBold,46,&H00FFFFFF,&H00FFFFFF,&H00000000,&H96000000,1,0,0,0,100,100,3,0,1,5,2,5,60,60,0,1",
"Style: Title,Inter ExtraBold,96,&H00FFFFFF,&H00FFFFFF,&H00000000,&H96000000,1,0,0,0,100,100,0,0,1,8,5,8,40,40,150,1",
"","[Events]","Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text"]
CY=1330
for s in TL['segs']:
    toks=SCRIPT[s['n']].split(); ws=s['words']; nw=len(ws); nt=len(toks)
    times=[]
    for i in range(nt):
        a=ws[min(nw-1,int(i*nw/nt))]; b=ws[min(nw-1,int((i+1)*nw/nt)-1 if int((i+1)*nw/nt)>int(i*nw/nt) else int(i*nw/nt))]
        times.append((a['s'],b['e']))
    # chunks of <=3 words, break on punctuation
    chunks=[];cur=[]
    for i,tk in enumerate(toks):
        cur.append(i)
        if len(cur)>=3 or re.search(r'[.!?,]$',tk): chunks.append(cur);cur=[]
    if cur: chunks.append(cur)
    col=COL[s['spk']]
    for ci,ch in enumerate(chunks):
        st=times[ch[0]][0]; en=times[chunks[ci+1][0]][0] if ci+1<len(chunks) else s['e']+0.2
        for wi in ch:
            ws_,we_=times[wi]; ws_=max(ws_,st); we_=times[wi+1][0] if wi+1<=ch[-1] else en
            parts=[]
            for wj in ch:
                w=toks[wj].upper()
                parts.append(("{\\c"+col+"\\fscx112\\fscy112}"+w+"{\\c&HFFFFFF&\\fscx100\\fscy100}") if wj==wi else w)
            pop="{\\pos(540,%d)\\t(0,80,\\fscx106\\fscy106)\\t(80,160,\\fscx100\\fscy100)}"%CY
            out.append(f"Dialogue: 1,{ts(ws_)},{ts(we_)},Cap,,0,0,0,,{pop}{' '.join(parts)}")
    if s['spk']!='N':
        out.append(f"Dialogue: 0,{ts(s['s'])},{ts(s['e']+0.2)},Name,,0,0,0,,{{\\pos(540,{CY-110})\\c{col}}}{NAME[s['spk']]}")
# intro title
s1=TL['segs'][0]
out.append(f"Dialogue: 2,{ts(0)},{ts(s1['e']+0.6)},Title,,0,0,0,,{{\\fad(200,300)\\pos(540,150)\\c&H0000E5FF&}}SANTOS DUMONT")
out.append(f"Dialogue: 2,{ts(0.3)},{ts(s1['e']+0.6)},Title,,0,0,0,,{{\\fad(150,300)\\pos(540,260)\\fs150\\c&H002020FF&\\t(0,300,\\fscx130\\fscy130)\\t(300,600,\\fscx100\\fscy100)}}VS")
out.append(f"Dialogue: 2,{ts(0.6)},{ts(s1['e']+0.6)},Title,,0,0,0,,{{\\fad(200,300)\\pos(540,430)\\c&H00FFC84A&}}NIKOLA TESLA")
vw=[w for w in s1['words'] if 'alend' in w['w'].lower()]
if vw:
    v=vw[0]; out.append(f"Dialogue: 3,{ts(v['s'])},{ts(v['s']+1.3)},Title,,0,0,0,,{{\\pos(540,960)\\fs190\\c&H0000E5FF&\\t(0,200,\\fscx125\\fscy125)\\t(200,400,\\fscx100\\fscy100)\\fad(0,250)}}VALENDO!")
# boom text
b=TL['boom']
out.append(f"Dialogue: 3,{ts(b)},{ts(b+1.4)},Title,,0,0,0,,{{\\pos(540,900)\\fs230\\c&H000090FF&\\frz-8\\t(0,150,\\fscx140\\fscy140)\\t(150,350,\\fscx100\\fscy100)\\fad(0,300)}}KABUM!")
# ending
s12=TL['segs'][-1]
out.append(f"Dialogue: 2,{ts(s12['s'])},{ts(TL['total'])},Title,,0,0,0,,{{\\fad(200,0)\\pos(540,170)\\fs110}}QUEM VENCEU?")
out.append(f"Dialogue: 2,{ts(s12['s']+2.0)},{ts(TL['total'])},Title,,0,0,0,,{{\\fad(200,0)\\pos(540,320)\\fs76\\c&H0000E5FF&}}AVIÃO {{\\c&HFFFFFF&}}ou {{\\c&H00FFC84A&}}RAIO?")
open('legendas.ass','w').write('\n'.join(out)+'\n')
print(len(out))
