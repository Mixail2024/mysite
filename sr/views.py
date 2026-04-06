from django.shortcuts import render
import pandas as pd
import os
from django.conf import settings
import datetime as dt
import json

silver = 'S'

week = ['Po', 'Ut', 'St', 'Ct', 'Pa', 'So', 'Ne']



class Rec:#************************************************************** CLASS REC
    def __init__(self, date, supervisor, model, quantity, order):

        global imported_date
        imported_date = date


        self.date = date
        self.model_supervisor = supervisor

        self.model = model
        self.splitted_model = self.model.split()
        self.model_short = self.splitted_model[0] + ' ' + self.splitted_model[1]
        if self.splitted_model[2].endswith('S'):
            self.model_colour = self.splitted_model[2]
            self.model_line = silver
        else:
            self.model_colour = self.splitted_model[2].rstrip('WL')
            self.model_line = 'SWL'
        self.modline = str(self.model_short) + ' ' + str(self.model_line)

        # check model_type
        self.model_type = 'not defined'
        if self.splitted_model[0] == 'DG':
            self.model_type = 'DG'
        elif self.splitted_model[0] == 'DJ':
            self.model_type = 'DJ'
        elif self.splitted_model[0] == 'DKL' and 'K' in self.splitted_model[1]:
            self.model_type = 'K'
        elif self.splitted_model[1].startswith('Y'):
            self.model_type = 'Y'
        else:
            self.model_type = 'A'




        # check BlackBox
        self.model_black_box = ''
        if self.splitted_model[1].startswith('Y') and self.model_line == silver:
            if self.splitted_model[1][1] == '3' or \
                    self.splitted_model[1][1] == '6' or \
                    self.splitted_model[1][1] == '9':
                self.model_black_box = 'BlackBox'

        elif self.splitted_model[0] == 'DKL' and self.model_line == silver:
            if self.splitted_model[1].startswith('1') or \
                    self.splitted_model[1].startswith('2') or \
                    self.splitted_model[1].startswith('5') or \
                    self.splitted_model[1].startswith('B'):
                self.model_black_box = 'BlackBox'

        self.model_quantity = quantity
        self.model_order = order

    def __repr__(self):
        return f'{self.model_short}, {self.model_colour}, {self.model_line}, {self.model_quantity}' # {self.model_black_box}'    {self.box}/{self.card}/{self.rail}'

class Materials():#*************************************************CLASS MATERIALS
    def __init__(self, model, box, card, rail, s1, s2, s3, s4, s5, w1, w2, w3, w4, w5):
        self.model = model
        self.box = box
        self.card = card
        self.rail = rail
        self.s1 = s1
        self.s2 = s2
        self.s3 = s3
        self.s4 = s4
        self.s5 = s5
        self.w1 = w1
        self.w2 = w2
        self.w3 = w3
        self.w4 = w4
        self.w5 = w5

    # def __repr__(self):
    #     return f'{self.model} / {self.box} / {self.card} / {self.rail}'



def index(request):
  return render(request, 'sr/index.html')




def sr(request):#=========================================================== INDEX

    context = {}
    if request.method == "POST" and request.FILES.get("file"):
        uploaded_file = request.FILES["file"]
        file_name = request.POST.get("file_name")

        file_path = os.path.join(settings.MEDIA_ROOT, "SR",
                                 "serv_vers.xlsx")  # ____________saving on server in 'media/sr'
        with open(file_path, "wb") as f:
            for chunk in uploaded_file.chunks():
                f.write(chunk)

        df = pd.read_excel(uploaded_file, sheet_name="Data")
        lst = []
        for _, row in df.iterrows():
            if pd.notna(row['Material']):
                date = str(row['Basic finish date'])
                supervisor = str(int(row['Production Supervisor']))
                material = str(row['Material'])
                quantity = int(row['Order quantity'])
                order = int(row['Order'])
                item = [date, supervisor, material, quantity, order]
                lst.append(item)

        original_all_objs = []
        for i in lst:
            original_all_objs.append(Rec(i[0], i[1], i[2], i[3], i[4]))


        qtys = stat_qtys(original_all_objs)
        context['qty_all'] = qtys['all']
        context['qty_silver'] = qtys['silver']
        context['qty_dg'] = qtys['dg']
        context['qty_dj'] = qtys['dj']
        context['qty_y'] = qtys['y']
        context['qty_k_s'] = qtys['k_s']
        context['qty_a_s'] = qtys['a_s']
        context['qty_wl'] = qtys['wl']
        context['qty_k_wl'] = qtys['k_wl']
        context['qty_a_wl'] = qtys['a_wl']




        lsts = stat_lsts(original_all_objs)
        lst_dg_grouped = get_grouped(lsts['dg'])
        lst_dg_rails = rails_qtys(lst_dg_grouped)



        lst_dj_grouped = get_grouped(lsts['dj'])
        lst_dj_rails = rails_qtys(lst_dj_grouped)


        lst_y_grouped = get_grouped(lsts['y'])
        lst_k_s_grouped = get_grouped(lsts['k_s'])
        lst_a_s_grouped = get_grouped(lsts['a_s'])
        lst_bb_grouped = get_grouped(lsts['bb'])
        lst_out_bb_grouped = get_grouped(lsts['out_bb'])
        lst_k_wl_grouped = get_grouped(lsts['k_wl'])
        lst_a_wl_grouped = get_grouped(lsts['a_wl'])

        context['lst_dg'] = lst_dg_grouped
        context['lst_dj'] = lst_dj_grouped
        context['lst_y'] = lst_y_grouped
        context['lst_k_s'] = lst_k_s_grouped
        context['lst_a_s'] = lst_a_s_grouped
        context['lst_bb'] = lst_bb_grouped
        context['lst_out_bb'] = lst_out_bb_grouped
        context['lst_k_wl'] = lst_k_wl_grouped
        context['lst_a_wl'] = lst_a_wl_grouped

        context['lst_dg_rails'] = lst_dg_rails
        context['lst_dj_rails'] = lst_dj_rails

        cur_date, open_date = get_date_info()

        all_grouped = get_grouped(original_all_objs)


        context['file_name'] = file_name
        context['cur_date'] = cur_date
        context['open_date'] = open_date

        context['all_grouped'] = all_grouped


    return render(request, 'sr/sr.html', context)



def sr2(request):#=========================================================== INDEX

    context = {}
    file_path = "sr/serv_vers.xlsx"

    #  Проверка существования файла
    if not os.path.exists(file_path):
        context['file_name'] = 'There is no file on server. Press "Home" and import file!'
        return render(request, 'sr/sr2.html', context)

    # если файл есть — продолжаем работу
    df = pd.read_excel("sr/serv_vers.xlsx", sheet_name="Data")
    lst = []
    for _, row in df.iterrows():
        if pd.notna(row['Material']):
            date = str(row['Basic finish date'])
            supervisor = str(int(row['Production Supervisor']))
            material = str(row['Material'])
            quantity = int(row['Order quantity'])
            order = int(row['Order'])
            item = [date, supervisor, material, quantity, order]
            lst.append(item)

    original_all_objs = []
    for i in lst:
        original_all_objs.append(Rec(i[0], i[1], i[2], i[3], i[4]))


    qtys = stat_qtys(original_all_objs)
    context['qty_all'] = qtys['all']
    context['qty_silver'] = qtys['silver']
    context['qty_dg'] = qtys['dg']
    context['qty_dj'] = qtys['dj']
    context['qty_y'] = qtys['y']
    context['qty_k_s'] = qtys['k_s']
    context['qty_a_s'] = qtys['a_s']
    context['qty_wl'] = qtys['wl']
    context['qty_k_wl'] = qtys['k_wl']
    context['qty_a_wl'] = qtys['a_wl']




    lsts = stat_lsts(original_all_objs)

    # robot_dj = robot(lsts['bb'])
    # print(robot_dj)

    lst_dg_grouped = get_grouped(lsts['dg'])
    lst_dg_rails = rails_qtys(lst_dg_grouped)

    lst_dj_grouped = get_grouped(lsts['dj'])
    lst_dj_rails = rails_qtys(lst_dj_grouped)

    lst_y_grouped = get_grouped(lsts['y'])
    lst_k_s_grouped = get_grouped(lsts['k_s'])
    lst_a_s_grouped = get_grouped(lsts['a_s'])
    lst_bb_grouped = get_grouped(lsts['bb'])
    lst_out_bb_grouped = get_grouped(lsts['out_bb'])
    lst_k_wl_grouped = get_grouped(lsts['k_wl'])
    lst_a_wl_grouped = get_grouped(lsts['a_wl'])

    context['robot_dj'] = robot(lsts['dj'])
    context['robot_dg'] = robot(lsts['dg'])
    context['robot_y'] = robot(lsts['y'])
    context['robot_k_s'] = robot(lsts['k_s'])
    context['robot_a_s'] = robot(lsts['a_s'])
    context['robot_bb'] = robot(lsts['bb'])
    context['robot_out_bb'] = robot(lsts['out_bb'])
    context['robot_k_wl'] = robot(lsts['k_wl'])
    context['robot_a_wl'] = robot(lsts['a_wl'])


    context['lst_dg'] = lst_dg_grouped
    context['lst_dj'] = lst_dj_grouped
    context['lst_y'] = lst_y_grouped
    context['lst_k_s'] = lst_k_s_grouped
    context['lst_a_s'] = lst_a_s_grouped
    context['lst_bb'] = lst_bb_grouped
    context['lst_out_bb'] = lst_out_bb_grouped
    context['lst_k_wl'] = lst_k_wl_grouped
    context['lst_a_wl'] = lst_a_wl_grouped

    context['lst_dg_rails'] = lst_dg_rails
    context['lst_dj_rails'] = lst_dj_rails

    cur_date, open_date = get_date_info()

    all_grouped = get_grouped(original_all_objs)


    context['file_name'] = 'File was loaded from server'
    context['cur_date'] = cur_date
    context['open_date'] = open_date

    context['all_grouped'] = all_grouped


    return render(request, 'sr/sr2.html', context)

def robot(lst_in):
    lst_inter = []
    for i in lst_in:
        mod = []
        if i.model_type == 'Y':
            mod.append(i.model_short[4:6])
            mod.append(i.model_quantity)

        elif i.model_type in ('DG', 'DJ'):
            mod.append(i.model_short[:5])
            mod.append(i.model_quantity)
        else:
            if i.model_short[4:5].startswith('1') or i.model_short[4:5].startswith('2'):
                mod.append(str(i.model_short[4:5])+'xx')
                mod.append(i.model_quantity)

            elif i.model_short[5:6].startswith('K'):
                mod.append(i.model_short[4:6])
                mod.append(i.model_quantity)

            else:
                mod.append(i.model_short[4:5])
                mod.append(i.model_quantity)
        lst_inter.append(mod)

    lst_out = []
    name = lst_inter[0][0]
    qty = 0

    for j in lst_inter:
        if j[0] == name:
            qty += j[1]
        else:
            lst_out.append(str(name)+' - '+str(qty))
            name = j[0]
            qty = j[1]

    lst_out.append(str(name)+' - '+str(qty))
    return lst_out





def rails_qtys(lst):
    if len(lst) > 0:
        lst_extracted = []
        for i in lst:
            parts = i.split("-")
            qty = int(parts[1].split("/")[0].strip())
            rail = i.strip().split("/")[-1].strip()

            lst_extracted.append([rail, qty])
        lst_summed_rail = [j[0] for j in lst_extracted]
        set_rails = set(lst_summed_rail)
        set_rails = (sorted(set_rails))
        dict = {}
        for r in set_rails:
            total_qty = 0
            for k in lst_extracted:
                if k[0] == r:
                    total_qty += k[1]
            dict[r] = total_qty
            json_rails = json.dumps(dict, indent=2)
            return json_rails
    else:
        json_rails = []
        return json_rails







def tt(request):#=========================================================== TT
    context = {}

    lst = get_materials_lst()
    context['lst'] = lst

    objs = get_materials()
    names = [x.model for x in objs]
    context['names'] = names


    return render(request, 'sr/timetable.html', context)





def get_materials():#========================================================  GET MATERIALS
    file_path = os.path.join(settings.BASE_DIR, 'materials.xlsx')
    df = pd.read_excel(file_path, sheet_name='Sheet1')
    lst=[]
    for _, row in df.iterrows():
        item = []
        if pd.notna(row['model']):  # Проверка на непустое значение в 'model'
            model = str(row['model'])
            box = int(row['box'])
            card = int(row['card'])
            rail = str(row['rail'])
            s1 = str(row['s1'])
            s2 = str(row['s2'])
            s3 = str(row['s3'])
            s4 = str(row['s4'])
            s5 = str(row['s5'])
            w1 = str(row['w1'])
            w2 = str(row['w2'])
            w3 = str(row['w3'])
            w4 = str(row['w4'])
            w5 = str(row['w5'])
            item = [model, box, card, rail, s1, s2, s3, s4, s5, w1, w2, w3, w4, w5]
        lst.append(item)
    materials_objs = []
    for i in lst:
        materials_objs.append(Materials(i[0], i[1], i[2], i[3], i[4], i[5], i[6], i[7], i[8], i[9], i[10], i[11], i[12],
                      i[13]))
    return materials_objs



def get_materials_lst():#========================================================  GET MATERIALS
    file_path = os.path.join(settings.BASE_DIR, 'materials.xlsx')
    df = pd.read_excel(file_path, sheet_name='Sheet1')
    lst=[]
    for _, row in df.iterrows():
        item = []
        if pd.notna(row['model']):  # Проверка на непустое значение в 'model'
            model = str(row['model'])
            box = int(row['box'])
            card = int(row['card'])
            rail = str(row['rail'])
            s1 = str(row['s1'])
            s2 = str(row['s2'])
            s3 = str(row['s3'])
            s4 = str(row['s4'])
            s5 = str(row['s5'])
            w1 = str(row['w1'])
            w2 = str(row['w2'])
            w3 = str(row['w3'])
            w4 = str(row['w4'])
            w5 = str(row['w5'])
            item = [model, box, card, rail, s1, s2, s3, s4, s5, w1, w2, w3, w4, w5]
        lst.append(item)

    return lst










def get_grouped(objs):  # ====================================================GET GROUPED
    materials_objs = get_materials()

    # Оптимизируем поиск материалов, создав словарь {модель: (box, card, rail)}
    material_map = {m.model: (m.box, m.card, m.rail) for m in materials_objs}

    grouped_lst_objs = {}
    lst = []
    qty = 0

    if not objs:
        return grouped_lst_objs  # Если список пуст, просто возвращаем пустой словарь

    model = objs[0].modline  # Начальная модель
    model_sh = objs[0].model_short

    for obj in objs:
        if obj.modline == model:
            lst.append(obj)
            qty += obj.model_quantity
        else:
            # Получаем box, card, rail для предыдущей группы
            box, card, rail = material_map.get(model_sh, (None, None, None))

            # Формируем ключ и сохраняем группу
            name = f"{model} - {qty} / {box} / {card} / {rail}"
            grouped_lst_objs[name] = lst

            # Начинаем новую группу
            lst = [obj]
            qty = obj.model_quantity
            model = obj.modline
            model_sh = obj.model_short

    # Добавляем последнюю группу после выхода из цикла
    box, card, rail = material_map.get(objs[-1].model_short, (None, None, None))
    name = f"{model} - {qty} / {box} / {card} / {rail}"
    grouped_lst_objs[name] = lst

    return grouped_lst_objs


def get_date_info():  # Функция для получения дат_____________ D A T E S_________________
        # Текущая дата, день недели, номер недели
        today = dt.datetime.today()
        cur_d_str = today.strftime('%d/%m/%Y')
        cur_weekday = week[today.weekday()]
        cur_week_num = today.isocalendar()[1]
        cur_date = (f'Today: {cur_d_str}, {cur_weekday}, W# {cur_week_num}')

        # Импортированная дата, день недели, номер недели
        open_d_obj = dt.datetime.strptime(imported_date, "%Y-%m-%d %H:%M:%S")  # получаем объект дата из заданого формата
        open_d_obj_formatted = open_d_obj.strftime("%d/%m/%Y")# преобразуем формат полученого объекта дата
        open_weekday = week[open_d_obj.weekday()]
        open_week_num = open_d_obj.isocalendar()[1]
        open_date = (f'Imported: {open_d_obj_formatted}, {open_weekday}, W# {open_week_num}')

        return cur_date, open_date

def stat_qtys(lst):#________________________________________STAT_QTYS_______________
    qtys = {}

    qtys['all'] = sum([i.model_quantity for i in lst])

    qtys['silver'] = sum([i.model_quantity for i in lst if i.model_line == silver])
    qtys['dg'] = sum([i.model_quantity for i in lst if i.model_type == 'DG'])
    qtys['dj'] = sum([i.model_quantity for i in lst if i.model_type == 'DJ'])
    qtys['y'] = sum([i.model_quantity for i in lst if i.model_type == 'Y'])
    qtys['k_s'] = sum([i.model_quantity for i in lst if i.model_type == 'K' and i.model_line == silver])
    qtys['a_s'] = sum([i.model_quantity for i in lst if i.model_type == 'A' and i.model_line == silver])

    qtys['wl'] = sum([i.model_quantity for i in lst if i.model_line == 'SWL'])
    qtys['k_wl'] = sum([i.model_quantity for i in lst if i.model_type == 'K' and i.model_line == 'SWL'])
    qtys['a_wl'] = sum([i.model_quantity for i in lst if i.model_type == 'A' and i.model_line == 'SWL'])


    return qtys

def stat_lsts(lst):
    lsts = {}
    lsts['dg'] = [i for i in lst if i.model_type == 'DG']
    lsts['dj'] = [i for i in lst if i.model_type == 'DJ']
    lsts['y'] = [i for i in lst if i.model_type == 'Y']
    lsts['k_s'] = [i for i in lst if i.model_type == 'K' and i.model_line == silver]
    lsts['a_s'] = [i for i in lst if i.model_type == 'A' and i.model_line == silver]

    lsts['bb'] = [i for i in lst if i.model_black_box == 'BlackBox']
    lsts['out_bb'] = [i for i in lst if i.model_line == silver and i.model_black_box != 'BlackBox' and i.model_type != 'K' and i.model_type != 'DG' and i.model_type != 'DJ' ]

    lsts['k_wl'] = [i for i in lst if i.model_type == 'K' and i.model_line == 'SWL']
    lsts['a_wl'] = [i for i in lst if i.model_type == 'A' and i.model_line == 'SWL']


    return lsts