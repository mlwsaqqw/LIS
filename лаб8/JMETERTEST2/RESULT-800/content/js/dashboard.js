/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 11.133967600925688, "KoPercent": 88.86603239907431};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.004004646612863781, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.001875, 500, 1500, "https://www.amry.ru/chemistry/avtohimiya/ochistiteli-dvigatelya-narujnie-hi-gear-hg5377.html"], "isController": false}, {"data": [0.0, 500, 1500, "https://www.amry.ru/chemistry/antifrizi/"], "isController": false}, {"data": [0.0078125, 500, 1500, "https://www.amry.ru/"], "isController": false}, {"data": [0.0, 500, 1500, "https://www.amry.ru/stocks/"], "isController": false}, {"data": [0.001875, 500, 1500, "https://www.amry.ru/accessories/bagajniki/"], "isController": false}, {"data": [0.0, 500, 1500, "https://www.amry.ru/tools/instrument-dlya-avtoelektroprovodki/"], "isController": false}, {"data": [0.0, 500, 1500, "https://www.amry.ru/chemistry/"], "isController": false}, {"data": [0.0702247191011236, 500, 1500, "https://www.amry.ru/shop/make_order.html?func=upd-1"], "isController": false}, {"data": [0.1151685393258427, 500, 1500, "https://www.amry.ru/shop/make_order.html?func=upd-0"], "isController": false}, {"data": [0.0, 500, 1500, "https://www.amry.ru/to_suppliers/"], "isController": false}, {"data": [0.0, 500, 1500, "https://www.amry.ru/lamps/scheme/"], "isController": false}, {"data": [0.00875, 500, 1500, "https://www.amry.ru/shop/basket.html"], "isController": false}, {"data": [0.0125, 500, 1500, "https://www.amry.ru/shop/make_order.html?func=upd"], "isController": false}, {"data": [0.0, 500, 1500, "https://www.amry.ru/accum/akkumulyator-6st---132-apz-bars-silver.html"], "isController": false}, {"data": [0.0, 500, 1500, "https://www.amry.ru/accum/"], "isController": false}, {"data": [0.0, 500, 1500, "Test"], "isController": true}, {"data": [0.0, 500, 1500, "https://www.amry.ru/accessories/"], "isController": false}, {"data": [0.0, 500, 1500, "https://www.amry.ru/tools/"], "isController": false}, {"data": [0.0, 500, 1500, "https://www.amry.ru/about/company/"], "isController": false}, {"data": [0.0, 500, 1500, "https://www.amry.ru/chemistry/avtohimiya/"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 15556, 13824, 88.86603239907431, 922.9065312419647, 69, 16877, 72.0, 3788.300000000001, 4946.15, 8172.900000000009, 87.63993036580487, 1713.7246580878625, 46.29232176131978], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://www.amry.ru/chemistry/avtohimiya/ochistiteli-dvigatelya-narujnie-hi-gear-hg5377.html", 800, 708, 88.5, 620.355, 69, 7108, 75.0, 2856.0999999999967, 5079.249999999997, 6172.95, 27.006042602032206, 494.9602016908314, 15.046901900550248], "isController": false}, {"data": ["https://www.amry.ru/chemistry/antifrizi/", 800, 725, 90.625, 823.0837499999998, 69, 13569, 70.0, 96.0, 7388.599999999994, 12252.940000000006, 20.092425155716295, 524.8096321202531, 10.368397754671488], "isController": false}, {"data": ["https://www.amry.ru/", 1600, 1375, 85.9375, 592.6837499999998, 70, 10229, 84.0, 3166.900000000002, 3740.699999999999, 4443.620000000001, 39.12650086811924, 1003.6244073710659, 19.42815606430196], "isController": false}, {"data": ["https://www.amry.ru/stocks/", 800, 755, 94.375, 289.6774999999999, 69, 5815, 71.0, 109.59999999999991, 3102.799999999993, 4627.620000000001, 72.97272644349175, 682.4442870336587, 35.81756533339415], "isController": false}, {"data": ["https://www.amry.ru/accessories/bagajniki/", 800, 704, 88.0, 795.4699999999999, 69, 8829, 71.0, 5186.799999999999, 6353.799999999998, 7470.920000000001, 13.52082206598161, 712.0745067276653, 7.051689680232558], "isController": false}, {"data": ["https://www.amry.ru/tools/instrument-dlya-avtoelektroprovodki/", 800, 746, 93.25, 643.1562499999997, 69, 12052, 70.0, 72.0, 7287.599999999994, 10171.86, 15.331544653123803, 206.60783585665007, 8.266307732847835], "isController": false}, {"data": ["https://www.amry.ru/chemistry/", 1600, 1472, 92.0, 1806.2424999999994, 70, 16877, 348.0, 4357.300000000003, 7416.399999999969, 11361.44, 19.779214517943455, 249.47218808719543, 9.929976944853077], "isController": false}, {"data": ["https://www.amry.ru/shop/make_order.html?func=upd-1", 178, 48, 26.96629213483146, 2101.016853932585, 69, 5115, 2370.0, 3985.0, 4390.15, 4985.440000000001, 3.0386315915259736, 220.10043995075026, 1.9617605071783404], "isController": false}, {"data": ["https://www.amry.ru/shop/make_order.html?func=upd-0", 178, 0, 0.0, 2508.382022471909, 349, 4272, 2678.5, 3547.1, 3852.05, 4162.980000000001, 2.971172945634212, 1.0679608865112087, 2.0395516533409004], "isController": false}, {"data": ["https://www.amry.ru/to_suppliers/", 800, 762, 95.25, 280.27125000000007, 69, 5893, 73.0, 84.0, 983.1499999999606, 4779.540000000001, 105.00065625410159, 773.8738064378527, 52.01326453602835], "isController": false}, {"data": ["https://www.amry.ru/lamps/scheme/", 800, 761, 95.125, 293.80750000000006, 70, 6114, 72.0, 74.0, 643.5499999999748, 5107.83, 14.496167575697175, 141.71858295431895, 7.42008421367351], "isController": false}, {"data": ["https://www.amry.ru/shop/basket.html", 800, 654, 81.75, 774.5362499999995, 70, 5627, 72.0, 3981.0, 4451.499999999999, 5154.330000000001, 13.39539868055323, 377.10089626205587, 6.9179908576404], "isController": false}, {"data": ["https://www.amry.ru/shop/make_order.html?func=upd", 800, 670, 83.75, 1101.5212499999996, 69, 8801, 73.0, 5324.899999999999, 6556.099999999998, 7781.030000000001, 13.181091723922034, 221.42470610284548, 10.424293421399502], "isController": false}, {"data": ["https://www.amry.ru/accum/akkumulyator-6st---132-apz-bars-silver.html", 800, 741, 92.625, 370.80250000000007, 69, 5281, 70.0, 82.0, 3854.899999999997, 4687.250000000001, 39.393342525113255, 465.47788086899254, 21.003883937364584], "isController": false}, {"data": ["https://www.amry.ru/accum/", 800, 756, 94.5, 482.31, 69, 8476, 70.0, 73.0, 5351.19999999999, 6740.98, 47.186504659667335, 1665.5817188237288, 23.15963415713106], "isController": false}, {"data": ["Test", 800, 800, 100.0, 16920.326250000002, 6851, 68100, 9548.0, 41158.7, 49793.99999999999, 60965.70000000001, 11.73898369748639, 4273.388735642673, 117.09247900281002], "isController": true}, {"data": ["https://www.amry.ru/accessories/", 800, 734, 91.75, 468.2812499999997, 69, 6223, 70.0, 285.9, 4710.449999999995, 5582.58, 13.775290572535514, 177.6967754520017, 7.042886353852777], "isController": false}, {"data": ["https://www.amry.ru/tools/", 800, 727, 90.875, 692.8037500000003, 70, 9457, 73.0, 95.89999999999998, 6425.8499999999985, 8661.59, 17.92395760984025, 321.8407186806847, 9.014577918804472], "isController": false}, {"data": ["https://www.amry.ru/about/company/", 800, 750, 93.75, 3839.894999999998, 3092, 8015, 3724.0, 4086.9, 4649.399999999996, 7004.9, 97.47776288534178, 912.41220813787, 48.07252954794687], "isController": false}, {"data": ["https://www.amry.ru/chemistry/avtohimiya/", 800, 736, 92.0, 646.5025, 69, 9197, 71.0, 84.89999999999998, 6793.649999999998, 8346.57, 28.47076408413111, 516.4518060028827, 14.430562475532938], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["503/Service Temporarily Unavailable", 13801, 99.83362268518519, 88.71817948058627], "isController": false}, {"data": ["529/Internal Server Error", 23, 0.16637731481481483, 0.1478529184880432], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 15556, 13824, "503/Service Temporarily Unavailable", 13801, "529/Internal Server Error", 23, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["https://www.amry.ru/chemistry/avtohimiya/ochistiteli-dvigatelya-narujnie-hi-gear-hg5377.html", 800, 708, "503/Service Temporarily Unavailable", 708, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://www.amry.ru/chemistry/antifrizi/", 800, 725, "503/Service Temporarily Unavailable", 725, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://www.amry.ru/", 1600, 1375, "503/Service Temporarily Unavailable", 1375, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://www.amry.ru/stocks/", 800, 755, "503/Service Temporarily Unavailable", 755, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://www.amry.ru/accessories/bagajniki/", 800, 704, "503/Service Temporarily Unavailable", 704, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://www.amry.ru/tools/instrument-dlya-avtoelektroprovodki/", 800, 746, "503/Service Temporarily Unavailable", 746, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://www.amry.ru/chemistry/", 1600, 1472, "503/Service Temporarily Unavailable", 1472, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://www.amry.ru/shop/make_order.html?func=upd-1", 178, 48, "503/Service Temporarily Unavailable", 48, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://www.amry.ru/to_suppliers/", 800, 762, "503/Service Temporarily Unavailable", 762, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://www.amry.ru/lamps/scheme/", 800, 761, "503/Service Temporarily Unavailable", 761, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://www.amry.ru/shop/basket.html", 800, 654, "503/Service Temporarily Unavailable", 654, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://www.amry.ru/shop/make_order.html?func=upd", 800, 670, "503/Service Temporarily Unavailable", 670, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://www.amry.ru/accum/akkumulyator-6st---132-apz-bars-silver.html", 800, 741, "503/Service Temporarily Unavailable", 741, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://www.amry.ru/accum/", 800, 756, "503/Service Temporarily Unavailable", 735, "529/Internal Server Error", 21, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://www.amry.ru/accessories/", 800, 734, "503/Service Temporarily Unavailable", 734, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://www.amry.ru/tools/", 800, 727, "503/Service Temporarily Unavailable", 727, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://www.amry.ru/about/company/", 800, 750, "503/Service Temporarily Unavailable", 750, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://www.amry.ru/chemistry/avtohimiya/", 800, 736, "503/Service Temporarily Unavailable", 734, "529/Internal Server Error", 2, "", "", "", "", "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
