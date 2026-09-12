(() => {
  const languages = {
    da: { label: 'Dansk', flag: '🇩🇰', htmlLang: 'da' },
    en: { label: 'English', flag: '🇬🇧', htmlLang: 'en' },
    de: { label: 'Deutsch', flag: '🇩🇪', htmlLang: 'de' },
    pl: { label: 'Polski', flag: '🇵🇱', htmlLang: 'pl' }
  };

  const entries = [
    // Contractor quiz and emergency help.
    ["Du ser et perfekt græsareal. Hvad tænker du?","You see a perfect lawn. What comes to mind?","Du siehst einen perfekten Rasen. Was denkst du?","Widzisz idealny trawnik. Co myślisz?"],
    ["Flot græs.","Nice grass.","Schöner Rasen.","Ładna trawa."],
    ["Der kunne måske være en terrasse.","There could be a patio here.","Hier könnte eine Terrasse hin.","Może przydałby się tu taras."],
    ["Der mangler helt klart et hul.","It clearly needs a hole.","Hier fehlt eindeutig ein Loch.","Zdecydowanie brakuje tu dziury."],
    ["Hvor er gravemaskinen?","Where is the excavator?","Wo ist der Bagger?","Gdzie jest koparka?"],
    ["Kunden siger: Det er bare en lille opgave. Hvad gør du?","The customer says: It is just a small job. What do you do?","Der Kunde sagt: Das ist nur eine Kleinigkeit. Was machst du?","Klient mówi: To tylko mała robota. Co robisz?"],
    ["Tager det helt roligt.","Stay perfectly calm.","Ganz ruhig bleiben.","Zachowuję spokój."],
    ["Tager ekstra værktøj med.","Bring extra tools.","Zusätzliches Werkzeug mitnehmen.","Zabieram dodatkowe narzędzia."],
    ["Bestiller en container.","Order a skip.","Einen Container bestellen.","Zamawiam kontener."],
    ["Ringer efter mere diesel og Pepsi Max.","Call for more diesel and Pepsi Max.","Mehr Diesel und Pepsi Max bestellen.","Dzwonię po więcej diesla i Pepsi Max."],
    ["Du finder et kabel i jorden. Hvad gør du?","You find a cable in the ground. What do you do?","Du findest ein Kabel im Boden. Was machst du?","Znajdujesz kabel w ziemi. Co robisz?"],
    ["Stopper og undersøger det.","Stop and investigate.","Anhalten und prüfen.","Zatrzymuję się i sprawdzam."],
    ["Kigger lidt nærmere.","Take a closer look.","Genauer hinschauen.","Przyglądam się bliżej."],
    ["Siger: Det stod ikke på tegningen.","Say: That was not on the drawing.","Sagen: Das stand nicht im Plan.","Mówię: Tego nie było na rysunku."],
    ["Råber: HVEM HAR LAGT DEN DER?","Shout: WHO PUT THAT THERE?","Rufen: WER HAT DAS DA HINGELEGT?","Krzyczę: KTO TO TUTAJ POŁOŻYŁ?"],
    ["Hvornår er et hul stort nok?","When is a hole big enough?","Wann ist ein Loch groß genug?","Kiedy dziura jest wystarczająco duża?"],
    ["Når opgaven er løst.","When the job is done.","Wenn die Arbeit erledigt ist.","Gdy zadanie jest wykonane."],
    ["Når kunden er tilfreds.","When the customer is happy.","Wenn der Kunde zufrieden ist.","Gdy klient jest zadowolony."],
    ["Når naboen begynder at kigge.","When the neighbour starts watching.","Wenn der Nachbar zuschaut.","Gdy sąsiad zaczyna się przyglądać."],
    ["Det spørgsmål giver ingen mening.","That question makes no sense.","Die Frage ergibt keinen Sinn.","To pytanie nie ma sensu."],
    ["Hvad er vigtigst på en arbejdsdag?","What matters most on a working day?","Was ist an einem Arbeitstag am wichtigsten?","Co jest najważniejsze w dniu pracy?"],
    ["Planlægning.","Planning.","Planung.","Planowanie."],
    ["Godt værktøj.","Good tools.","Gutes Werkzeug.","Dobre narzędzia."],
    ["Gravemaskinen.","The excavator.","Der Bagger.","Koparka."],
    ["Pepsi Max og en dårlig idé.","Pepsi Max and a bad idea.","Pepsi Max und eine schlechte Idee.","Pepsi Max i zły pomysł."],
    ["Kontormenneske","Office person","Büromensch","Człowiek biura"],
    ["Du bruger ord som projektplan uden at grine.","You say project plan without laughing.","Du sagst Projektplan, ohne zu lachen.","Mówisz plan projektu bez śmiechu."],
    ["Lærling med potentiale","Promising apprentice","Lehrling mit Potenzial","Praktykant z potencjałem"],
    ["Du kigger stadig efter ledningsplaner. Det er sødt.","You still look for utility plans. Adorable.","Du suchst noch nach Leitungsplänen. Wie süß.","Nadal szukasz planów instalacji. Urocze."],
    ["Godkendt til mindre huller","Approved for small holes","Für kleine Löcher zugelassen","Uprawniony do małych dziur"],
    ["Du må gerne få en skovl. Gravemaskinen venter lidt endnu.","You may have a shovel. The excavator can wait.","Du darfst eine Schaufel haben. Der Bagger wartet noch.","Możesz dostać łopatę. Koparka jeszcze poczeka."],
    ["Professionel hullespecialist","Professional hole specialist","Professioneller Lochspezialist","Profesjonalny specjalista od dziur"],
    ["Du er nu farligt tæt på at få lov til at vælge skovlstørrelse.","You are dangerously close to choosing the bucket size.","Du darfst bald die Schaufelgröße wählen. Gefährlich nah.","Jesteś niebezpiecznie blisko wyboru rozmiaru łyżki."],
    ["FULD SEND","FULL SEND","VOLLGAS","PEŁNY GAZ"],
    ["Du ser ikke problemer. Du ser jord, der endnu ikke er flyttet.","You see no problems. Only soil that has not been moved yet.","Du siehst keine Probleme. Nur Erde, die noch nicht bewegt wurde.","Nie widzisz problemów. Tylko ziemię, której jeszcze nie przeniesiono."],
    ["TJØRRING ENTREPRENØR","TJØRRING ENTREPRENØR","TJØRRING ENTREPRENØR","TJØRRING ENTREPRENØR"],
    ["Vi beklager. Der findes ingen behandling.","Sorry. There is no treatment.","Tut uns leid. Es gibt keine Behandlung.","Przykro nam. Na to nie ma lekarstwa."],
    ["Der mangler et hul","A hole is missing","Ein Loch fehlt","Brakuje dziury"],
    ["Diagnose: Akut mangel på hul.","Diagnosis: Acute hole deficiency.","Diagnose: Akuter Lochmangel.","Diagnoza: Ostry niedobór dziury."],
    ["Heldigvis kan det behandles.","Fortunately, it can be treated.","Zum Glück ist das behandelbar.","Na szczęście da się to leczyć."],
    ["Hullet er for lille","The hole is too small","Das Loch ist zu klein","Dziura jest za mała"],
    ["Diagnose: Klassisk undergravning.","Diagnosis: Classic under-digging.","Diagnose: Klassischer Unteraushub.","Diagnoza: Klasyczne niedokopanie."],
    ["Anbefalet behandling: Gør hullet større.","Recommended treatment: Make the hole bigger.","Empfohlene Behandlung: Das Loch vergrößern.","Zalecane leczenie: Powiększyć dziurę."],
    ["Der er noget i vejen","Something is in the way","Etwas steht im Weg","Coś stoi na drodze"],
    ["Diagnose: Objekt placeret forkert.","Diagnosis: Object in the wrong place.","Diagnose: Objekt falsch platziert.","Diagnoza: Obiekt w złym miejscu."],
    ["Standardprocedure: Flyt det. Eventuelt med skovlen.","Standard procedure: Move it. Possibly with the bucket.","Standardverfahren: Verschieben. Eventuell mit der Schaufel.","Standardowa procedura: Przesunąć. Ewentualnie łyżką."],
    ["Kunden sagde: Det tager kun en time","The customer said: It only takes an hour","Der Kunde sagte: Das dauert nur eine Stunde","Klient powiedział: To zajmie tylko godzinę"],
    ["Diagnose: Urealistiske forventninger.","Diagnosis: Unrealistic expectations.","Diagnose: Unrealistische Erwartungen.","Diagnoza: Nierealistyczne oczekiwania."],
    ["Forventet behandlingstid: Resten af dagen.","Expected treatment time: The rest of the day.","Erwartete Behandlungsdauer: Den Rest des Tages.","Przewidywany czas leczenia: Reszta dnia."],
    ["Jeg ved det ikke, men vi skal bruge en gravemaskine","No idea, but we need an excavator","Keine Ahnung, aber wir brauchen einen Bagger","Nie wiem, ale potrzebujemy koparki"],
    ["Diagnose: Perfekte arbejdsforhold.","Diagnosis: Perfect working conditions.","Diagnose: Perfekte Arbeitsbedingungen.","Diagnoza: Idealne warunki pracy."],
    ["Start maskinen.","Start the machine.","Maschine starten.","Uruchom maszynę."],
    ["HVOR MEGET ENTREPRENØR ER DU?","HOW MUCH OF A CONTRACTOR ARE YOU?","WIE VIEL BAUUNTERNEHMER STECKT IN DIR?","ILE JEST W TOBIE WYKONAWCY?"],
    ["PERSONALEAFDELINGEN HAR EN TEST","HR HAS A TEST","DIE PERSONALABTEILUNG HAT EINEN TEST","DZIAŁ KADR MA TEST"],
    ["Fem spørgsmål. Ingen gyldige kvalifikationer.","Five questions. No valid qualifications.","Fünf Fragen. Keine gültige Qualifikation.","Pięć pytań. Żadnych ważnych kwalifikacji."],
    ["Spørgsmål","Question","Frage","Pytanie"],
    ["af","of","von","z"],
    ["Vælg ét svar for at fortsætte.","Choose one answer to continue.","Wähle eine Antwort, um fortzufahren.","Wybierz jedną odpowiedź, aby kontynuować."],
    ["NÆSTE","NEXT","WEITER","DALEJ"],
    ["VIS DOMMEN","SHOW THE VERDICT","URTEIL ANZEIGEN","POKAŻ WERDYKT"],
    ["PRØV IGEN","TRY AGAIN","NOCHMAL VERSUCHEN","SPRÓBUJ JESZCZE RAZ"],
    ["DOMMEN ER FALDET","THE VERDICT IS IN","DAS URTEIL STEHT FEST","WERDYKT ZAPADŁ"],
    ["Pepsi Max-kompatibilitet","Pepsi Max compatibility","Pepsi-Max-Kompatibilität","Zgodność z Pepsi Max"],
    ["AKUT ENTREPRENØRHJÆLP","EMERGENCY CONTRACTOR HELP","BAUUNTERNEHMER-SOFORTHILFE","PILNA POMOC WYKONAWCY"],
    ["BEREDSKAB UDEN GARANTI","EMERGENCY RESPONSE WITHOUT GUARANTEES","BEREITSCHAFT OHNE GARANTIE","POGOTOWIE BEZ GWARANCJI"],
    ["Kun humor. Ingen bestilling, kontakt eller udrykning.","Humour only. No booking, contact or dispatch.","Nur Humor. Keine Buchung, Kontaktaufnahme oder Anfahrt.","Tylko żart. Bez zamówienia, kontaktu ani wyjazdu."],
    ["JEG HAR BRUG FOR EN GRAVEMASKINE NU","I NEED AN EXCAVATOR NOW","ICH BRAUCHE JETZT EINEN BAGGER","POTRZEBUJĘ KOPARKI TERAZ"],
    ["Rolig. Først det vigtigste: Er der Pepsi Max?","Stay calm. First things first: Is there Pepsi Max?","Ruhig bleiben. Das Wichtigste zuerst: Gibt es Pepsi Max?","Spokojnie. Najpierw najważniejsze: Jest Pepsi Max?"],
    ["JA","YES","JA","TAK"],
    ["NEJ","NO","NEIN","NIE"],
    ["⚠️ Situationen er mere alvorlig end først antaget.","⚠️ The situation is more serious than we thought.","⚠️ Die Lage ist ernster als zunächst gedacht.","⚠️ Sytuacja jest poważniejsza, niż sądziliśmy."],
    ["Find Pepsi Max. Vi venter med at stille flere spørgsmål.","Find Pepsi Max. We will hold the remaining questions.","Besorg Pepsi Max. Weitere Fragen können warten.","Zdobądź Pepsi Max. Pozostałe pytania poczekają."],
    ["JEG HAR SKAFFET PEPSI MAX","I HAVE FOUND PEPSI MAX","ICH HABE PEPSI MAX BESORGT","MAM JUŻ PEPSI MAX"],
    ["Hvad er problemet?","What is the problem?","Was ist das Problem?","Jaki jest problem?"],
    ["AKTIVÉR FULD SEND","ACTIVATE FULL SEND","VOLLGAS AKTIVIEREN","AKTYWUJ PEŁNY GAZ"],
    ["🚜 FULD SEND AKTIVERET","🚜 FULL SEND ACTIVATED","🚜 VOLLGAS AKTIVIERT","🚜 PEŁNY GAZ AKTYWOWANY"],
    ["En gravemaskine er nu følelsesmæssigt på vej.","An excavator is now emotionally on its way.","Ein Bagger ist jetzt gefühlsmäßig unterwegs.","Koparka jest już w drodze. Emocjonalnie."],
    ["Start forfra","Start over","Von vorne beginnen","Zacznij od nowa"],
    // Hole calculator and daily excuse, using the existing four-language registry.
    ["⚠️ PLANLÆGNING MED FORBEHOLD","⚠️ PLANNING, ALLEGEDLY","⚠️ PLANUNG UNTER VORBEHALT","⚠️ PLANOWANIE Z ZASTRZEŻENIAMI"],
    ["HVOR STORT ET HUL HAR DU EGENTLIG BRUG FOR?","HOW BIG A HOLE DO YOU REALLY NEED?","WIE GROSS MUSS DEIN LOCH EIGENTLICH SEIN?","JAK DUŻEJ DZIURY NAPRAWDĘ POTRZEBUJESZ?"],
    ["Længde i meter","Length in metres","Länge in Metern","Długość w metrach"],
    ["Bredde i meter","Width in metres","Breite in Metern","Szerokość w metrach"],
    ["Dybde i meter","Depth in metres","Tiefe in Metern","Głębokość w metrach"],
    ["Længde/bredde: 0–100 m. Dybde: 0–20 m. Tomme felter tæller som 0.","Length/width: 0–100 m. Depth: 0–20 m. Empty fields count as 0.","Länge/Breite: 0–100 m. Tiefe: 0–20 m. Leere Felder zählen als 0.","Długość/szerokość: 0–100 m. Głębokość: 0–20 m. Puste pola liczą się jako 0."],
    ["trillebøre","wheelbarrows","Schubkarren","taczek"],
    ["fantasitrailere","imaginary trailers","Fantasieanhänger","fikcyjnych przyczep"],
    ["meget lange lørdage","very long Saturdays","sehr lange Samstage","bardzo długich sobót"],
    ["Kun for sjov: 0,12 m³ pr. trillebør, 3 m³ pr. fantasitrailer og lørdag. Ikke en transport- eller vægtberegning.","Just for fun: 0.12 m³ per wheelbarrow, 3 m³ per imaginary trailer and Saturday. Not a transport or weight calculation.","Nur zum Spaß: 0,12 m³ pro Schubkarre, 3 m³ pro Fantasieanhänger und Samstag. Keine Transport- oder Gewichtsberechnung.","Tylko dla żartu: 0,12 m³ na taczkę, 3 m³ na fikcyjną przyczepę i sobotę. To nie obliczenia transportowe ani wagowe."],
    ["GØR HULLET STØRRE","MAKE THE HOLE BIGGER","MACH DAS LOCH GRÖSSER","POWIĘKSZ DZIURĘ"],
    ["Jeg fortryder","I regret this","Ich bereue es","Żałuję tego"],
    ["AFDELINGEN FOR FORKLARINGER","DEPARTMENT OF EXPLANATIONS","ABTEILUNG FÜR ERKLÄRUNGEN","DZIAŁ WYJAŚNIEŃ"],
    ["DAGENS UNDSKYLDNING","EXCUSE OF THE DAY","AUSREDE DES TAGES","WYMÓWKA DNIA"],
    ["NY UNDSKYLDNING","NEW EXCUSE","NEUE AUSREDE","NOWA WYMÓWKA"],
    ["Godkendt af ledelsen. Gyldig til næste spørgsmål.","Approved by management. Valid until the next question.","Von der Leitung genehmigt. Gültig bis zur nächsten Frage.","Zatwierdzone przez szefostwo. Ważne do następnego pytania."],
    ["Det dér er næsten bare en aggressiv blomsterkrukke.","That is basically an aggressive flowerpot.","Das ist fast nur ein aggressiver Blumentopf.","To prawie tylko agresywna doniczka."],
    ["Det starter altid sådan her.","It always starts like this.","So fängt es immer an.","Zawsze tak się zaczyna."],
    ["Nu begynder naboen at blive nysgerrig.","Now the neighbour is getting curious.","Jetzt wird der Nachbar neugierig.","Teraz sąsiad zaczyna się interesować."],
    ["Det her kræver mere end en skovl og optimisme.","This needs more than a shovel and optimism.","Das braucht mehr als eine Schaufel und Optimismus.","Tu potrzeba czegoś więcej niż łopaty i optymizmu."],
    ["Kommunen vil muligvis gerne høre om det her.","The council might want to hear about this.","Die Gemeinde möchte davon vielleicht erfahren.","Gmina może chcieć o tym usłyszeć."],
    ["Vi antager, at du har en gravemaskine. Og en plan. Forhåbentlig.","We assume you have an excavator. And a plan. Hopefully.","Wir nehmen an, du hast einen Bagger. Und einen Plan. Hoffentlich.","Zakładamy, że masz koparkę. I plan. Miejmy nadzieję."],
    ["Sådan. Meget bedre.","There. Much better.","So. Viel besser.","Tak. Znacznie lepiej."],
    ["Nu er hullet stort nok. Selv for os.","The hole is big enough now. Even for us.","Jetzt ist das Loch groß genug. Selbst für uns.","Dziura jest już wystarczająco duża. Nawet dla nas."],
    ["Vi lader som om, det aldrig skete.","Let us pretend that never happened.","Tun wir so, als wäre das nie passiert.","Udawajmy, że to się nigdy nie wydarzyło."],
    ["Maskinen skulle lige tænke.","The machine needed a moment to think.","Die Maschine musste kurz nachdenken.","Maszyna musiała chwilę pomyśleć."],
    ["Jorden var hårdere end forventet.","The ground was harder than expected.","Der Boden war härter als erwartet.","Ziemia była twardsza, niż oczekiwano."],
    ["Vi ventede på en Pepsi Max.","We were waiting for a Pepsi Max.","Wir haben auf eine Pepsi Max gewartet.","Czekaliśmy na Pepsi Max."],
    ["Google Maps sagde drej til venstre.","Google Maps said turn left.","Google Maps sagte: links abbiegen.","Google Maps kazało skręcić w lewo."],
    ["Det så nemmere ud på YouTube.","It looked easier on YouTube.","Auf YouTube sah es einfacher aus.","Na YouTube wyglądało to łatwiej."],
    ["Der stod ikke noget om det kabel.","Nobody mentioned that cable.","Von dem Kabel stand da nichts.","O tym kablu nic nie było napisane."],
    ["Nogen havde parkeret en gravemaskine i vejen.","Someone had parked an excavator in the way.","Jemand hatte einen Bagger in den Weg gestellt.","Ktoś zaparkował koparkę na drodze."],
    ["Vi målte to gange. Det hjalp ikke.","We measured twice. It did not help.","Wir haben zweimal gemessen. Es hat nicht geholfen.","Zmierzyliśmy dwa razy. Nie pomogło."],
    ["Det begyndte som en fem minutters opgave.","It started as a five-minute job.","Es fing als Fünf-Minuten-Aufgabe an.","Zaczęło się od zadania na pięć minut."],
    ["Det var sådan, da vi kom.","It was like that when we arrived.","Das war schon so, als wir ankamen.","Tak już było, kiedy przyjechaliśmy."],
    ['⚠️ ADVARSEL: ENTREPRENØRMASKINER KAN FOREKOMME ⚠️','⚠️ WARNING: CONSTRUCTION MACHINERY MAY OCCUR ⚠️','⚠️ WARNUNG: BAUMASCHINEN KÖNNEN AUFTAUCHEN ⚠️','⚠️ UWAGA: MASZYNY BUDOWLANE MOGĄ SIĘ POJAWIĆ ⚠️'],
    ['Kompetencer','Skills','Leistungen','Umiejętności'],
    ['Live status','Live status','Live-Status','Status na żywo'],
    ['Anmeldelser','Reviews','Bewertungen','Opinie'],
    ['PANIK!','PANIC!','PANIK!','PANIKA!'],
    ['Tjørring · Herning · Omegn · Måske','Tjørring · Herning · Nearby · Maybe','Tjørring · Herning · Umgebung · Vielleicht','Tjørring · Herning · Okolice · Być może'],
    ['ÅH NEJ...','OH NO...','OH NEIN...','O NIE...'],
    ['ER PÅ VEJ.','IS ON THE WAY.','IST UNTERWEGS.','JEST W DRODZE.'],
    ['Vi ved ikke helt hvorhen endnu, men maskinen er startet.','We are not entirely sure where yet, but the machine has started.','Wir wissen noch nicht genau wohin, aber die Maschine läuft.','Nie wiemy jeszcze dokładnie dokąd, ale maszyna już ruszyła.'],
    ['🚜 HVOR ER DE NU?','🚜 WHERE ARE THEY NOW?','🚜 WO SIND SIE JETZT?','🚜 GDZIE ONI TERAZ SĄ?'],
    ['* Forventet ankomsttid kan variere med Pepsi Max-indtag, dieselpris og humør.','* Expected arrival may vary with Pepsi Max intake, diesel prices and mood.','* Die erwartete Ankunft kann je nach Pepsi-Max-Konsum, Dieselpreis und Laune variieren.','* Przewidywany czas przyjazdu może zależeć od Pepsi Max, ceny diesla i humoru.'],
    ['Åh Nej · Tjørring Entreprenør Er På Vej','Oh No · Tjørring Entreprenør Is On The Way','Oh Nein · Tjørring Entreprenør Ist Unterwegs','O Nie · Tjørring Entreprenør Jest W Drodze'],
    ['Dokumenterede kompetencer*','Documented skills*','Dokumentierte Leistungen*','Udokumentowane umiejętności*'],
    ['Hvad kan vi?','What can we do?','Was können wir?','Co potrafimy?'],
    ['Mere end man lige skulle tro. Mindre end vi selv påstår.','More than you might think. Less than we claim.','Mehr als man denkt. Weniger als wir behaupten.','Więcej, niż można się spodziewać. Mniej, niż sami twierdzimy.'],
    ['Grave huller','Dig holes','Löcher graben','Kopać dziury'],
    ['Vi graver dem både store og små. Nogle gange endda dér, hvor de skal være.','We dig them big and small. Sometimes even where they are supposed to be.','Wir graben große und kleine. Manchmal sogar dort, wo sie sein sollen.','Kopiemy duże i małe. Czasem nawet tam, gdzie powinny być.'],
    ['Fylde dem igen','Fill them back in','Wieder zuschütten','Zasypywać je z powrotem'],
    ['Har vi gravet det forkerte sted? Intet problem. Vi kan også fylde hullet igen.','Did we dig in the wrong place? No problem. We can fill it back in too.','Am falschen Ort gegraben? Kein Problem. Wir können das Loch auch wieder füllen.','Wykopaliśmy w złym miejscu? Żaden problem. Potrafimy też zasypać dziurę.'],
    ['Stå og kigge','Stand and stare','Herumstehen und schauen','Stać i patrzeć'],
    ['Enhver større opgave kræver minimum 20 minutters intensiv stirren ned i et hul.','Every major job requires at least 20 minutes of intense staring into a hole.','Jeder größere Auftrag braucht mindestens 20 Minuten intensives Starren in ein Loch.','Każde większe zlecenie wymaga co najmniej 20 minut intensywnego patrzenia w dziurę.'],
    ['* Ordet “dokumenterede” bruges meget løst.','* The word “documented” is used very loosely.','* Das Wort „dokumentiert“ wird sehr großzügig verwendet.','* Słowo „udokumentowane” jest używane bardzo luźno.'],
    ['📡 Tjørring Entreprenør Live','📡 Tjørring Entreprenør Live','📡 Tjørring Entreprenør Live','📡 Tjørring Entreprenør Live'],
    ['Aktuel driftsstatus','Current operating status','Aktueller Betriebsstatus','Aktualny status pracy'],
    ['Nuværende status','Current status','Aktueller Status','Aktualny status'],
    ['🟢 Angiveligt på arbejde','🟢 Allegedly working','🟢 Angeblich bei der Arbeit','🟢 Podobno w pracy'],
    ['Diesel','Diesel','Diesel','Diesel'],
    ['Dagens plan','Today’s plan','Tagesplan','Plan na dziś'],
    ['Gravemaskine','Excavator','Bagger','Koparka'],
    ['🚜 Brummer','🚜 Goes brrrr','🚜 Brummt','🚜 Brum brum'],
    ['Forventet ankomst','Expected arrival','Erwartete Ankunft','Przewidywany przyjazd'],
    ['Mellem nu og torsdag','Between now and Thursday','Zwischen jetzt und Donnerstag','Między teraz a czwartkiem'],
    ['fra dig','from you','von dir','od ciebie'],
    ['Beregn igen','Calculate again','Neu berechnen','Przelicz ponownie'],
    ['Meget videnskabeligt beregnet ✓','Very scientifically calculated ✓','Sehr wissenschaftlich berechnet ✓','Bardzo naukowo obliczone ✓'],
    ['* Komplet opdigtet.','* Completely made up.','* Komplett erfunden.','* Całkowicie zmyślone.'],
    ['Produktivitetskontrol','Productivity control','Produktivitätskontrolle','Kontrola produktywności'],
    ['Pepsi Max = mere entreprenør.','Pepsi Max = more contractor.','Pepsi Max = mehr Bauunternehmer.','Pepsi Max = więcej wykonawcy.'],
    ['NORMAL DRIFT','NORMAL OPERATION','NORMALBETRIEB','NORMALNA PRACA'],
    ['ENTREPRENØR-O-METER™','CONTRACTOR-O-METER™','BAUUNTERNEHMER-O-METER™','WYKONAWCA-O-METR™'],
    ['ENTREPRENØR','CONTRACTOR','BAUUNTERNEHMER','WYKONAWCA'],
    ['Forsigtig','Careful','Vorsichtig','Ostrożnie'],
    ['FULD SEND 🚜','FULL SEND 🚜','VOLLGAS 🚜','PEŁNY GAZ 🚜'],
    ['⚡ KABEL-LOTTERIET™','⚡ CABLE LOTTERY™','⚡ KABEL-LOTTERIE™','⚡ LOTERIA KABLOWA™'],
    ['Ligger der et kabel?','Is there a cable?','Liegt da ein Kabel?','Czy leży tu kabel?'],
    ['Der er kun én videnskabelig måde at finde ud af det på.','There is only one scientific way to find out.','Es gibt nur eine wissenschaftliche Methode, das herauszufinden.','Jest tylko jeden naukowy sposób, żeby to sprawdzić.'],
    ['⚡ UNDERSØG JORDEN','⚡ CHECK THE GROUND','⚡ BODEN PRÜFEN','⚡ SPRAWDŹ ZIEMIĘ'],
    ['⚡ PRØV IGEN','⚡ TRY AGAIN','⚡ NOCHMAL','⚡ SPRÓBUJ PONOWNIE'],
    ['DAGENS HØJVIDENSKABELIGE OPGAVE','TODAY’S HIGHLY SCIENTIFIC TASK','HEUTIGE HOCHWISSENSCHAFTLICHE AUFGABE','DZISIEJSZE WYSOCE NAUKOWE ZADANIE'],
    ['Der står en gammel terrasse i vejen.','An old patio is in the way.','Eine alte Terrasse steht im Weg.','Stary taras stoi na drodze.'],
    ['🚜 GIV OS EN OPGAVE','🚜 GIVE US A TASK','🚜 GIB UNS EINE AUFGABE','🚜 DAJ NAM ZADANIE'],
    ['GRAV FØRST – SPØRG BAGEFTER™','DIG FIRST – ASK LATER™','ERST GRABEN – DANN FRAGEN™','NAJPIERW KOP – POTEM PYTAJ™'],
    ['Arbejdsmiljøkoordinatoren er ikke blevet spurgt.','The safety coordinator was not consulted.','Der Sicherheitskoordinator wurde nicht gefragt.','Koordynator BHP nie został zapytany.'],
    ['af alle huller er lavet med vilje.','of all holes are made on purpose.','aller Löcher sind absichtlich entstanden.','wszystkich dziur powstało celowo.'],
    ['vil vi helst ikke snakke om.','we would rather not talk about.','darüber reden wir lieber nicht.','o tym wolimy nie rozmawiać.'],
    ['arkæologiske fund anmeldt indtil videre.','archaeological finds reported so far.','archäologische Funde bisher gemeldet.','znalezisk archeologicznych zgłoszono do tej pory.'],
    ['dåser Pepsi Max*','cans of Pepsi Max*','Dosen Pepsi Max*','puszek Pepsi Max*'],
    ['* Tallet er muligvis grebet ud af luften.','* The number may have been pulled out of thin air.','* Die Zahl könnte frei erfunden sein.','* Liczba mogła zostać wzięta z powietrza.'],
    ['Kundetilfredshed-ish','Customer satisfaction-ish','Kundenzufriedenheit-ish','Zadowolenie klientów-ish'],
    ['Hvad siger kunderne?','What do the customers say?','Was sagen die Kunden?','Co mówią klienci?'],
    ['“De kom.”','“They came.”','„Sie kamen.“','„Przyjechali.”'],
    ['— Kunde, angiveligt','— Customer, allegedly','— Kunde, angeblich','— Klient, podobno'],
    ['“Jeg havde en indkørsel før.”','“I used to have a driveway.”','„Ich hatte mal eine Einfahrt.“','„Kiedyś miałem podjazd.”'],
    ['— Tidligere kunde','— Former customer','— Ehemaliger Kunde','— Były klient'],
    ['“Ved ikke hvad de lavede, men maskinen lød dyr.”','“No idea what they did, but the machine sounded expensive.”','„Keine Ahnung, was sie gemacht haben, aber die Maschine klang teuer.“','„Nie wiem, co robili, ale maszyna brzmiała drogo.”'],
    ['— Nabo','— Neighbor','— Nachbar','— Sąsiad'],
    ['baseret på anmeldelser, vi selv har skrevet.','based on reviews we wrote ourselves.','basierend auf Bewertungen, die wir selbst geschrieben haben.','na podstawie opinii, które sami napisaliśmy.'],
    ['“Bad om et lille hul. Fik et stort hul. 10/10.”','“Asked for a small hole. Got a big hole. 10/10.”','„Kleines Loch bestellt. Großes Loch bekommen. 10/10.“','„Poprosiłem o małą dziurę. Dostałem dużą. 10/10.”'],
    ['“Min hæk er væk.”','“My hedge is gone.”','„Meine Hecke ist weg.“','„Mój żywopłot zniknął.”'],
    ['— Naboen','— The neighbor','— Der Nachbar','— Sąsiad'],
    ['Svar fra Tjørring Entreprenør:','Reply from Tjørring Entreprenør:','Antwort von Tjørring Entreprenør:','Odpowiedź Tjørring Entreprenør:'],
    ['Tak for din feedback. Vi fandt den.','Thanks for your feedback. We found it.','Danke für dein Feedback. Wir haben sie gefunden.','Dziękujemy za opinię. Znaleźliśmy go.'],
    ['“De kom til tiden. Det var faktisk lidt mistænkeligt.”','“They arrived on time. Honestly, a little suspicious.”','„Sie kamen pünktlich. Ehrlich gesagt etwas verdächtig.“','„Przyjechali na czas. Szczerze mówiąc, trochę podejrzane.”'],
    ['— Anonym','— Anonymous','— Anonym','— Anonim'],
    ['Ofte stillede spørgsmål','Frequently asked questions','Häufig gestellte Fragen','Najczęściej zadawane pytania'],
    ['Kan I komme i morgen?','Can you come tomorrow?','Könnt ihr morgen kommen?','Czy możecie przyjechać jutro?'],
    ['Nej.','No.','Nein.','Nie.'],
    ['Hvornår kan I så komme?','So when can you come?','Wann könnt ihr dann kommen?','To kiedy możecie przyjechać?'],
    ['Ja.','Yes.','Ja.','Tak.'],
    ['Giver I et fast tilbud?','Do you give a fixed quote?','Gebt ihr ein Festpreisangebot?','Dajecie stałą wycenę?'],
    ['Vi kan i hvert fald give et tilbud.','We can definitely give you a quote.','Ein Angebot können wir auf jeden Fall geben.','Na pewno możemy dać jakąś wycenę.'],
    ['Er I forsikrede?','Are you insured?','Seid ihr versichert?','Macie ubezpieczenie?'],
    ['Næste spørgsmål.','Next question.','Nächste Frage.','Następne pytanie.'],
    ['Hvorfor hedder I Tjørring Entreprenør?','Why are you called Tjørring Entreprenør?','Warum heißt ihr Tjørring Entreprenør?','Dlaczego nazywacie się Tjørring Entreprenør?'],
    ['Marketingafdelingen havde fri.','The marketing department had the day off.','Die Marketingabteilung hatte frei.','Dział marketingu miał wolne.'],
    ['Hvorfor siger I “Åh Nej”?','Why do you say “Oh No”?','Warum sagt ihr „Oh Nein“?','Dlaczego mówicie „O Nie”?'],
    ['Det plejer kunden at gøre først.','Usually the customer says it first.','Normalerweise sagt der Kunde das zuerst.','Zwykle klient mówi to pierwszy.'],
    ['Kan I grave et hul?','Can you dig a hole?','Könnt ihr ein Loch graben?','Możecie wykopać dziurę?'],
    ['Hvor stort?','How big?','Wie groß?','Jak dużą?'],
    ['Kan I grave et meget stort hul?','Can you dig a very big hole?','Könnt ihr ein sehr großes Loch graben?','Możecie wykopać bardzo dużą dziurę?'],
    ['Nu begynder det at ligne noget.','Now we are talking.','Jetzt wird es interessant.','No, teraz zaczyna to wyglądać ciekawie.'],
    ['Hvad hvis der ligger et kabel?','What if there is a cable?','Was, wenn da ein Kabel liegt?','A jeśli leży tam kabel?'],
    ['Det gjorde der.','There was.','Da lag eins.','Leżał.'],
    ['Hvornår kommer I?','When are you coming?','Wann kommt ihr?','Kiedy przyjedziecie?'],
    ['Åh nej... vi er allerede på vej.','Oh no... we are already on the way.','Oh nein... wir sind schon unterwegs.','O nie... już jesteśmy w drodze.'],
    ['🚨 AKUT HUL?','🚨 EMERGENCY HOLE?','🚨 NOTFALL-LOCH?','🚨 PILNA DZIURA?'],
    ['Har du et hul, du ikke selv kan klare?','Got a hole you cannot handle yourself?','Hast du ein Loch, das du nicht selbst schaffst?','Masz dziurę, z którą sam sobie nie poradzisz?'],
    ['Tjørring Entreprenør står klar. Eller sidder ned. Det kommer lidt an på tidspunktet.','Tjørring Entreprenør is standing by. Or sitting down. Depends on the time of day.','Tjørring Entreprenør steht bereit. Oder sitzt. Kommt auf die Uhrzeit an.','Tjørring Entreprenør jest gotowy. Albo siedzi. Zależy od pory dnia.'],
    ['☎ RING FØR DIN NABO GØR DET','☎ CALL BEFORE YOUR NEIGHBOR DOES','☎ RUF AN, BEVOR ES DEIN NACHBAR TUT','☎ ZADZWOŃ, ZANIM ZROBI TO SĄSIAD'],
    ['⚠️ TRYK IKKE HER','⚠️ DO NOT CLICK HERE','⚠️ NICHT HIER KLICKEN','⚠️ NIE KLIKAJ TUTAJ'],
    ['Professionel hjemmeside','Professional website','Professionelle Website','Profesjonalna strona'],
    ['Vi graver, derfor er vi.','We dig, therefore we are.','Wir graben, also sind wir.','Kopiemy, więc jesteśmy.'],
    ['⚠️ Denne hjemmeside bør ikke anvendes som dokumentation for noget som helst.','⚠️ This website should not be used as documentation for anything whatsoever.','⚠️ Diese Website sollte für absolut nichts als Dokumentation verwendet werden.','⚠️ Ta strona nie powinna być używana jako dokumentacja czegokolwiek.'],
    ['FOR SENT.','TOO LATE.','ZU SPÄT.','ZA PÓŹNO.'],
    ['Vi er allerede kørt.','We already left.','Wir sind schon losgefahren.','Już pojechaliśmy.'],
    ['Det var satans','Well, damn','Verdammt','No pięknie'],
    ['Stop med at trykke på gravemaskinen.','Stop clicking the excavator.','Hör auf, auf den Bagger zu klicken.','Przestań klikać koparkę.'],
    ['🚨 TJØRRING ENTREPRENØR ER PÅ VEJ! 🚨','🚨 TJØRRING ENTREPRENØR IS ON THE WAY! 🚨','🚨 TJØRRING ENTREPRENØR IST UNTERWEGS! 🚨','🚨 TJØRRING ENTREPRENØR JEST W DRODZE! 🚨'],
    ['🚜 Gravemaskine startet...','🚜 Excavator started...','🚜 Bagger gestartet...','🚜 Koparka uruchomiona...'],
    ['💨 Fuld gas...','💨 Full throttle...','💨 Vollgas...','💨 Pełny gaz...'],
    ['🥤 Pepsi Max er sikret...','🥤 Pepsi Max secured...','🥤 Pepsi Max gesichert...','🥤 Pepsi Max zabezpieczona...'],
    ['⚠️ Naboen er informeret...','⚠️ Neighbor informed...','⚠️ Nachbar informiert...','⚠️ Sąsiad poinformowany...'],
    ['✅ For sent at fortryde.','✅ Too late to regret it.','✅ Zu spät zum Bereuen.','✅ Za późno na żałowanie.'],
    ['🕳️ Undskyld. Vi kom til at grave i hjemmesiden.','🕳️ Sorry. We accidentally dug into the website.','🕳️ Entschuldigung. Wir haben aus Versehen in die Website gegraben.','🕳️ Przepraszamy. Przypadkiem wykopaliśmy dziurę w stronie.'],
    ['PROFESSIONEL TILSTAND','PROFESSIONAL MODE','PROFESSIONELLER MODUS','TRYB PROFESJONALNY'],
    ['Ingen jokes. Ingen panik. Ingen dårlige beslutninger.','No jokes. No panic. No bad decisions.','Keine Witze. Keine Panik. Keine schlechten Entscheidungen.','Bez żartów. Bez paniki. Bez złych decyzji.'],
    ['DET HER HOLDER VI IKKE UD.','WE CANNOT KEEP THIS UP.','DAS HALTEN WIR NICHT AUS.','NIE WYTRZYMAMY TEGO.'],
    ['Den fjollede hjemmeside er tilbage.','The silly website is back.','Die alberne Website ist zurück.','Głupkowata strona wróciła.'],
    ['Bare rolig. Vi skulle den anden vej.','Relax. We were going the other way.','Keine Sorge. Wir mussten in die andere Richtung.','Spokojnie. Jechaliśmy w drugą stronę.'],
    ['❓ Ukendt','❓ Unknown','❓ Unbekannt','❓ Nieznany'],
    ['🕳️ Grave noget','🕳️ Dig something','🕳️ Etwas graben','🕳️ Coś wykopać'],
    ['👀 Kigge ned i et hul','👀 Stare into a hole','👀 In ein Loch schauen','👀 Patrzeć w dziurę'],
    ['🥤 Strategisk Pepsi Max-pause','🥤 Strategic Pepsi Max break','🥤 Strategische Pepsi-Max-Pause','🥤 Strategiczna przerwa na Pepsi Max'],
    ['📏 Måle to gange. Grave tre.','📏 Measure twice. Dig three times.','📏 Zweimal messen. Dreimal graben.','📏 Mierz dwa razy. Kop trzy.'],
    ['⛽ Det går nok','⛽ It will probably be fine','⛽ Wird schon gehen','⛽ Jakoś to będzie'],
    ['⛽ Nok-ish','⛽ Enough-ish','⛽ Genug-ish','⛽ Chyba wystarczy'],
    ['⛽ Mere end i går','⛽ More than yesterday','⛽ Mehr als gestern','⛽ Więcej niż wczoraj'],
    ['⛽ Spørg ikke','⛽ Do not ask','⛽ Nicht fragen','⛽ Nie pytaj'],
    ['⛽ 73% + moms','⛽ 73% + VAT','⛽ 73% + MwSt.','⛽ 73% + VAT'],
    ['Naboen sagde, at hækken skulle blive stående.','The neighbor said the hedge should stay.','Der Nachbar sagte, die Hecke solle stehen bleiben.','Sąsiad powiedział, że żywopłot ma zostać.'],
    ['Der ligger muligvis et kabel her.','There may be a cable here.','Hier könnte ein Kabel liegen.','Może tu leżeć kabel.'],
    ['Nogen har bestilt 14 tons stabilgrus. Ingen ved hvem.','Someone ordered 14 tons of gravel. Nobody knows who.','Jemand hat 14 Tonnen Schotter bestellt. Niemand weiß wer.','Ktoś zamówił 14 ton kruszywa. Nikt nie wie kto.'],
    ['Indkørslen ser alt for hel ud.','The driveway looks far too intact.','Die Einfahrt sieht viel zu unversehrt aus.','Podjazd wygląda zdecydowanie zbyt dobrze.'],
    ['Der mangler et hul. Vi ved bare ikke hvor.','A hole is missing. We just do not know where.','Ein Loch fehlt. Wir wissen nur nicht wo.','Brakuje dziury. Tylko nie wiemy gdzie.'],
    ['Kunden sagde: “Det tager vel kun en time?”','The customer said: “It only takes an hour, right?”','Der Kunde sagte: „Das dauert doch nur eine Stunde?“','Klient powiedział: „To chyba tylko godzina?”'],
    ['En stub har kigget forkert på os.','A tree stump looked at us funny.','Ein Baumstumpf hat uns komisch angeschaut.','Pień drzewa krzywo na nas spojrzał.'],
    ['✅ Nej. Grav bare. Hvad kan gå galt?','✅ No. Just dig. What could go wrong?','✅ Nein. Einfach graben. Was soll schon schiefgehen?','✅ Nie. Po prostu kop. Co może pójść nie tak?'],
    ['👀 Måske. Det er spændende.','👀 Maybe. Exciting.','👀 Vielleicht. Spannend.','👀 Może. Ekscytujące.'],
    ['🤷 Spørg ikke os.','🤷 Do not ask us.','🤷 Frag uns nicht.','🤷 Nas nie pytaj.'],
    ['⚡ 73% sandsynlighed. Det er næsten sikkert nok.','⚡ 73% probability. Almost certain enough.','⚡ 73% Wahrscheinlichkeit. Fast sicher genug.','⚡ 73% prawdopodobieństwa. Prawie wystarczająco pewne.'],
    ['💥 Det gjorde der.','💥 There was.','💥 Da lag eins.','💥 Był.'],
    ['📞 Ledningsejerregistret har forladt chatten.','📞 The utility register has left the chat.','📞 Das Leitungsregister hat den Chat verlassen.','📞 Rejestr sieci opuścił czat.'],
    ['📡 Scanner jorden med meget dyr fantasi...','📡 Scanning the ground with very expensive imagination...','📡 Boden wird mit sehr teurer Fantasie gescannt...','📡 Skanowanie ziemi bardzo drogą wyobraźnią...'],
    ['⚠️ OVERTRYK — ARBEJDSHASTIGHED +40%','⚠️ OVERPRESSURE — WORK SPEED +40%','⚠️ ÜBERDRUCK — ARBEITSTEMPO +40%','⚠️ NADCIŚNIENIE — PRĘDKOŚĆ PRACY +40%'],
    ['PEPSI MAX TILFØRT','PEPSI MAX ADDED','PEPSI MAX HINZUGEFÜGT','DODANO PEPSI MAX'],
    ['🔧 Hjemmesiden er lappet. Nogenlunde.','🔧 Website patched. More or less.','🔧 Website geflickt. Mehr oder weniger.','🔧 Strona załatana. Mniej więcej.'],
    ['⚠️ ENTREPRENØR MODE AKTIVERET — FULD SEND 🚜','⚠️ CONTRACTOR MODE ACTIVATED — FULL SEND 🚜','⚠️ BAUUNTERNEHMER-MODUS AKTIV — VOLLGAS 🚜','⚠️ TRYB WYKONAWCY AKTYWNY — PEŁNY GAZ 🚜'],
    ['🥤 MANGLER PEPSI MAX','🥤 NEEDS PEPSI MAX','🥤 BRAUCHT PEPSI MAX','🥤 BRAKUJE PEPSI MAX'],
    ['📊 Helt ægte statistik*','📊 Totally real statistics*','📊 Wirklich echte Statistik*','📊 Całkiem prawdziwe statystyki*'],
    ['Hvor mange har kigget forbi?','How many stopped by?','Wie viele haben vorbeigeschaut?','Ile osób tu zajrzało?'],
    ['Vi tæller rigtige sidevisninger. Gravemaskinen tæller ikke som besøgende. Endnu.','We count real page views. The excavator does not count as a visitor. Yet.','Wir zählen echte Seitenaufrufe. Der Bagger zählt noch nicht als Besucher.','Liczymy prawdziwe odsłony. Koparka jeszcze nie liczy się jako odwiedzający.'],
    ['Rigtige besøg. Rigtige visninger. Stadig stærkt tvivlsom entreprenør-humor.','Real visits. Real views. Still highly questionable contractor humor.','Echte Besuche. Echte Aufrufe. Weiterhin höchst fragwürdiger Bauunternehmer-Humor.','Prawdziwe wizyty. Prawdziwe odsłony. Nadal mocno wątpliwy humor wykonawcy.'],
    ['BESØGSMÅLER','VISITOR METER','BESUCHSZÄHLER','LICZNIK ODWIEDZIN'],
    ['Siden vi begyndte at grave på internettet','Since we started digging on the internet','Seit wir im Internet zu graben begannen','Odkąd zaczęliśmy kopać w internecie'],
    ['Sidevisninger','Page views','Seitenaufrufe','Odsłony'],
    ['Unikke besøgende','Unique visitors','Eindeutige Besucher','Unikalni odwiedzający'],
    ['Seneste 24 timer','Last 24 hours','Letzte 24 Stunden','Ostatnie 24 godziny'],
    ['Besøg på denne enhed','Visits on this device','Besuche auf diesem Gerät','Wizyty na tym urządzeniu'],
    ['* Tallene er rigtige. Kommentarerne er stadig stærkt tvivlsomme.','* The numbers are real. The commentary is still highly questionable.','* Die Zahlen sind echt. Die Kommentare bleiben höchst fragwürdig.','* Liczby są prawdziwe. Komentarze nadal mocno wątpliwe.']
  ];

  const keys = new Map();
  const reverse = { da:new Map(), en:new Map(), de:new Map(), pl:new Map() };
  entries.forEach((row, i) => {
    const key = `t${i}`;
    keys.set(key, { da:row[0], en:row[1], de:row[2], pl:row[3] });
    ['da','en','de','pl'].forEach((lang, n) => reverse[lang].set(row[n].trim(), key));
  });

  let currentLang = localStorage.getItem('tjoerring-language') || new URLSearchParams(location.search).get('lang') || 'da';
  if (!languages[currentLang]) currentLang = 'da';
  let translating = false;

  function findKey(text) {
    const clean = text.trim();
    if (!clean) return null;
    for (const lang of Object.keys(reverse)) {
      const key = reverse[lang].get(clean);
      if (key) return key;
    }
    return null;
  }

  function translateTextNode(node) {
    if (!node.nodeValue || !node.nodeValue.trim()) return;
    const key = findKey(node.nodeValue);
    if (!key) return;
    const original = node.nodeValue;
    const lead = original.match(/^\s*/)?.[0] || '';
    const trail = original.match(/\s*$/)?.[0] || '';
    const next = lead + keys.get(key)[currentLang] + trail;
    if (node.nodeValue !== next) node.nodeValue = next;
  }

  function translateElement(root = document.body) {
    if (!root) return;
    translating = true;
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        const p = node.parentElement;
        if (!p || ['SCRIPT','STYLE','NOSCRIPT'].includes(p.tagName) || p.closest('.language-menu, [data-tool-dynamic]')) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    let n;
    while ((n = walker.nextNode())) translateTextNode(n);
    if (document.documentElement.lang !== languages[currentLang].htmlLang) {
      document.documentElement.lang = languages[currentLang].htmlLang;
    }
    translating = false;
    updateSelector();
  }

  function updateSelector() {
    const btn = document.getElementById('languageButton');
    if (btn && btn.dataset.language !== currentLang) {
      btn.dataset.language = currentLang;
      btn.innerHTML = `<span aria-hidden="true">🌐</span> ${languages[currentLang].flag} <span class="language-code">${currentLang.toUpperCase()}</span>`;
    }
    document.querySelectorAll('.language-option').forEach(el => el.classList.toggle('active', el.dataset.lang === currentLang));
  }

  function setLanguage(lang) {
    if (!languages[lang]) return;
    currentLang = lang;
    localStorage.setItem('tjoerring-language', lang);
    translateElement();
    document.dispatchEvent(new Event('tjoerring:languagechange'));
    document.getElementById('languageMenu')?.classList.remove('open');
    document.getElementById('languageButton')?.setAttribute('aria-expanded','false');
    document.body.classList.add('language-fade');
    setTimeout(() => document.body.classList.remove('language-fade'), 220);
  }

  function installSelector() {
    if (document.getElementById('languageSwitcher')) return;
    const nav = document.querySelector('.nav');
    const panic = nav?.querySelector(':scope > .panic-btn');
    if (!nav || !panic) return;

    const style = document.createElement('style');
    style.textContent = `
      .language-switcher{position:relative;margin-left:auto}.language-button{min-width:92px;padding:11px 13px;background:#111;color:#fff;border:1px solid #3a3a3a;border-radius:9px;font-weight:900;cursor:pointer;display:flex;gap:6px;align-items:center;justify-content:center}.language-button:hover,.language-button[aria-expanded="true"]{border-color:#f6c400;color:#f6c400}.language-menu{position:absolute;right:0;top:calc(100% + 9px);z-index:90;width:190px;background:#111;border:1px solid #3a3a3a;border-radius:12px;padding:7px;box-shadow:0 18px 45px #000c;display:none}.language-menu.open{display:grid}.language-option{border:0;background:transparent;color:#eee;text-align:left;padding:11px 12px;border-radius:8px;font-weight:800;cursor:pointer}.language-option:hover,.language-option.active{background:#f6c400;color:#111}.language-fade main,.language-fade footer{animation:languageFade .22s ease}@keyframes languageFade{0%{opacity:.62}100%{opacity:1}}@media(max-width:900px){.language-switcher{margin-left:auto}.language-button{min-width:78px;padding:9px 10px}.language-code{display:inline}}@media(max-width:620px){.nav{gap:8px}.language-button{min-width:68px;font-size:13px}.language-menu{right:-70px;width:175px}}
    `;
    document.head.appendChild(style);

    const box = document.createElement('div');
    box.className = 'language-switcher';
    box.id = 'languageSwitcher';
    box.innerHTML = `<button class="language-button" id="languageButton" type="button" aria-haspopup="true" aria-expanded="false"></button><div class="language-menu" id="languageMenu" role="menu">${Object.entries(languages).map(([code,l]) => `<button type="button" class="language-option" data-lang="${code}" role="menuitem">${l.flag} ${l.label}</button>`).join('')}</div>`;
    nav.insertBefore(box, panic);

    const btn = box.querySelector('#languageButton');
    const menu = box.querySelector('#languageMenu');
    btn.addEventListener('click', e => { e.stopPropagation(); const open = menu.classList.toggle('open'); btn.setAttribute('aria-expanded', String(open)); });
    box.querySelectorAll('.language-option').forEach(option => option.addEventListener('click', () => setLanguage(option.dataset.lang)));
    document.addEventListener('click', e => { if (!box.contains(e.target)) { menu.classList.remove('open'); btn.setAttribute('aria-expanded','false'); } });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') { menu.classList.remove('open'); btn.setAttribute('aria-expanded','false'); } });
    updateSelector();
  }

  installSelector();
  translateElement();

  const observer = new MutationObserver(mutations => {
    if (translating) return;
    let changed = false;
    for (const m of mutations) {
      const parent = m.target.nodeType === Node.TEXT_NODE ? m.target.parentElement : m.target;
      if (parent.closest?.('[data-tool-dynamic]')) continue;
      if (m.type === 'characterData' || m.addedNodes.length) { changed = true; break; }
    }
    if (changed) requestAnimationFrame(() => translateElement());
  });
  observer.observe(document.body, { subtree:true, childList:true, characterData:true });

  window.TjoerringI18n = { setLanguage, getLanguage: () => currentLang, languages, text: value => keys.get(findKey(value))?.[currentLang] || value };
  document.dispatchEvent(new Event('tjoerring:languagechange'));
})();