$(function(){
    function factorial(n) {
    if (n==0)
      return 1;
    return n ? n * factorial(n - 1) : 1;
    }
    
    $("#go").click(function(){
    var N = + $("#N").val();
    var T0 = + $("#T_0").val();
    var Tp = + $("#T_p").val();
    var tk = + $("#t_k").val();
    var C = + $("#C").val();
    var tpr = + $("#t_pr").val();
    var td = + $("#t_d").val();
    var Pi = 1/$("#m").val();
    var B=1/(1-$("#gamma").val());
    var K1 = 0.995; // + $("#K1").val();
    var K2 = 100; // + $("#K2").val();
    var delta = + $("#delta").val();
    var Nzn = + $("#N_zn").val();

    var m1 = + (1/(2*tk)); //считает Lf1
    var m2 = + (C/(B*tpr));
    var m3 = + (1/(B*Pi*td));
    var m4 = + ((N-1)/N);
    var min = + Math.min(m1,m2,m3);
    var Lf1 = K1 * min * m4; //Lf1

    console.log("BEGIN")

    var L_f_start=Lf1;
    var Tk=0;
    var Tpr=0;
    var Td=0;
    var N_iter=0;
    var Lf=0;

    while(true){ //цикл
        N_iter++;
        Tk = ((2*tk)/(1-2*Lf1*tk));
        
        var Tnpsub = Math.pow(B*Lf1*tpr/C, C);
        Tpr = ((B*tpr)/(1-Tnpsub));
        Td = ((B*td)/(1-B*Pi*Lf1*td));

        Lf=(N-1)/(T0+Tp+Tk+Tpr+Td);
        var d = Math.abs(Lf1-Lf)/Lf;
        if (d < delta || N_iter == 99999){ //выход из цикла
            break;
        }
        Lf1=Lf1-(Lf1-Lf)/K2; //переопределяем Lf1
    }
    var T_cycle=T0+Tp+Tk+Tpr+Td;

    var calculations = {
      pho_rs: ((T0+Tp)/T_cycle), // Загрузка рабочей станции
      pho_polz: (Tp/T_cycle), // Загрузка пользователя рабочей станции
      pho_k: 2*(N/T_cycle)*tk, // Загрузка канала
      pho_pr: B*(N/T_cycle)*tpr/C, // Загрузка процессора
      pho_d: B*(N/T_cycle)*Pi*td, // Загрузка дисков
      
      N_ispr_rab_st: (N*(T0+Tp)/T_cycle), // Среднее количество работающих PC

      T_cycle, // Среднее время цикла системы
      T_reac: T_cycle-Tp, // Среднее время реакции системы

      L_f_start, // Начальная интенсивность фонового потока
      L_f_kon: Lf1, // Конечная интенсивность фонового потока
      // N_iter Количество итераций
    }


    console.log(Date.now().toString(), calculations);

    Object.entries(calculations).forEach(([key, value]) => $('#' + key).html(value.toFixed(Nzn)))
    $("#N_iter").html(N_iter);


    // $("#res8").html(T_reac.toFixed(Nzn));
    // var pho_k=2*(N/T_cycle)*tk;
    // $("#res4").html(pho_k.toFixed(Nzn));
    // var pho_pr=B*(N/T_cycle)*tpr/C;
    // $("#res5").html(pho_pr.toFixed(Nzn));
    // var pho_d=B*(N/T_cycle)*Pi*td;
    // $("#res6").html(pho_d.toFixed(Nzn));
    
    // $("#res1").html(((T0+Tp)/T_cycle).toFixed(Nzn));
    // $("#res2").html((Tp/T_cycle).toFixed(Nzn));
    // $("#res3").html((N*(T0+Tp)/T_cycle).toFixed(Nzn));
    // $("#res7").html(T_cycle.toFixed(Nzn));
    // $("#res9").html(L_f_start.toFixed(Nzn));
    // $("#res10").html(Lf1.toFixed(Nzn));
    // $("#res11").html(n);

    })
})