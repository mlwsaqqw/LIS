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

    var data = {"OkPercent": 86.52380952380952, "KoPercent": 13.476190476190476};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.11181818181818182, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.045, 500, 1500, "https://www.amry.ru/chemistry/avtohimiya/ochistiteli-dvigatelya-narujnie-hi-gear-hg5377.html"], "isController": false}, {"data": [0.03, 500, 1500, "https://www.amry.ru/chemistry/antifrizi/"], "isController": false}, {"data": [0.24, 500, 1500, "https://www.amry.ru/"], "isController": false}, {"data": [0.0, 500, 1500, "https://www.amry.ru/stocks/"], "isController": false}, {"data": [0.015, 500, 1500, "https://www.amry.ru/accessories/bagajniki/"], "isController": false}, {"data": [0.105, 500, 1500, "https://www.amry.ru/tools/instrument-dlya-avtoelektroprovodki/"], "isController": false}, {"data": [0.14, 500, 1500, "https://www.amry.ru/chemistry/"], "isController": false}, {"data": [0.25, 500, 1500, "https://www.amry.ru/shop/make_order.html?func=upd-1"], "isController": false}, {"data": [0.53, 500, 1500, "https://www.amry.ru/shop/make_order.html?func=upd-0"], "isController": false}, {"data": [0.0, 500, 1500, "https://www.amry.ru/to_suppliers/"], "isController": false}, {"data": [0.135, 500, 1500, "https://www.amry.ru/lamps/scheme/"], "isController": false}, {"data": [0.15, 500, 1500, "https://www.amry.ru/shop/basket.html"], "isController": false}, {"data": [0.22, 500, 1500, "https://www.amry.ru/shop/make_order.html?func=upd"], "isController": false}, {"data": [0.0, 500, 1500, "https://www.amry.ru/accum/akkumulyator-6st---132-apz-bars-silver.html"], "isController": false}, {"data": [0.0, 500, 1500, "https://www.amry.ru/accum/"], "isController": false}, {"data": [0.0, 500, 1500, "Test"], "isController": true}, {"data": [0.045, 500, 1500, "https://www.amry.ru/accessories/"], "isController": false}, {"data": [0.155, 500, 1500, "https://www.amry.ru/tools/"], "isController": false}, {"data": [0.02, 500, 1500, "https://www.amry.ru/about/company/"], "isController": false}, {"data": [0.0, 500, 1500, "https://www.amry.ru/chemistry/avtohimiya/"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 2100, 283, 13.476190476190476, 2428.046190476194, 69, 8197, 2240.5, 4701.8, 5700.599999999995, 7017.98, 12.258765016987146, 1889.8183864874843, 7.413902014158873], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://www.amry.ru/chemistry/avtohimiya/ochistiteli-dvigatelya-narujnie-hi-gear-hg5377.html", 100, 27, 27.0, 2552.2400000000007, 69, 6963, 3097.0, 4773.700000000001, 6439.899999999999, 6962.15, 3.36802398033074, 377.8794960488869, 2.0125258916843487], "isController": false}, {"data": ["https://www.amry.ru/chemistry/antifrizi/", 100, 0, 0.0, 4316.9, 1266, 7353, 4513.0, 6389.400000000001, 6718.049999999999, 7348.2599999999975, 2.6625485915117952, 721.3894593029448, 1.4638816963097077], "isController": false}, {"data": ["https://www.amry.ru/", 200, 0, 0.0, 1759.5499999999997, 646, 3811, 1639.0, 3042.9, 3435.2499999999995, 3737.75, 4.950249987624375, 879.4059400292683, 2.8642803883471113], "isController": false}, {"data": ["https://www.amry.ru/stocks/", 100, 44, 44.0, 2060.64, 69, 5013, 2506.0, 4605.4, 4959.3499999999985, 5012.82, 9.569377990430622, 824.5234935705743, 5.0134569377990434], "isController": false}, {"data": ["https://www.amry.ru/accessories/bagajniki/", 100, 0, 0.0, 3227.720000000001, 1107, 4605, 3216.5, 4167.200000000001, 4388.9, 4604.88, 2.35316265060241, 1019.4418344152979, 1.2983758765530873], "isController": false}, {"data": ["https://www.amry.ru/tools/instrument-dlya-avtoelektroprovodki/", 100, 0, 0.0, 2745.609999999999, 1067, 6220, 2253.0, 4869.0, 5373.549999999999, 6218.82, 2.6087183366811884, 492.9164890156654, 1.4903322528891556], "isController": false}, {"data": ["https://www.amry.ru/chemistry/", 200, 23, 11.5, 2693.559999999999, 70, 6388, 1954.0, 5719.3, 5903.2, 6242.700000000001, 2.410335518704204, 195.11637777791168, 1.3803760838977537], "isController": false}, {"data": ["https://www.amry.ru/shop/make_order.html?func=upd-1", 100, 0, 0.0, 1490.1599999999992, 644, 3528, 1489.0, 2550.2000000000003, 2728.7, 3525.4599999999987, 2.52035184111702, 249.3131548976737, 1.6933613932504978], "isController": false}, {"data": ["https://www.amry.ru/shop/make_order.html?func=upd-0", 100, 0, 0.0, 1088.3499999999997, 373, 2961, 880.0, 2243.9, 2425.1999999999994, 2956.399999999998, 2.472187886279357, 0.8643000618046971, 1.7817135352286773], "isController": false}, {"data": ["https://www.amry.ru/to_suppliers/", 100, 42, 42.0, 2007.59, 70, 5378, 2659.0, 4103.400000000001, 4607.449999999999, 5371.869999999997, 12.600806451612902, 1024.540316674017, 6.52190177671371], "isController": false}, {"data": ["https://www.amry.ru/lamps/scheme/", 100, 0, 0.0, 1854.0899999999995, 831, 3212, 1810.0, 2535.7000000000003, 2825.5999999999985, 3208.9699999999984, 2.574002574002574, 477.32773789414415, 1.39760296010296], "isController": false}, {"data": ["https://www.amry.ru/shop/basket.html", 100, 0, 0.0, 1798.4900000000002, 663, 3663, 1804.5, 3043.400000000001, 3117.95, 3662.7799999999997, 2.387831610114855, 360.0870588481101, 1.3035135449748085], "isController": false}, {"data": ["https://www.amry.ru/shop/make_order.html?func=upd", 100, 0, 0.0, 2578.6700000000005, 1041, 5415, 2799.5, 4611.000000000001, 4864.899999999999, 5414.76, 2.43125623009409, 241.34980876650215, 3.385714242298996], "isController": false}, {"data": ["https://www.amry.ru/accum/akkumulyator-6st---132-apz-bars-silver.html", 100, 22, 22.0, 2598.4099999999994, 69, 4649, 3064.0, 3944.5, 4084.2, 4645.289999999998, 5.327082889409759, 626.1830910065523, 3.028321769124228], "isController": false}, {"data": ["https://www.amry.ru/accum/", 100, 47, 47.0, 2891.39, 70, 5629, 3798.5, 5100.3, 5283.55, 5626.439999999999, 6.750826976304598, 2241.61025155269, 3.5542049213528655], "isController": false}, {"data": ["Test", 100, 86, 86.0, 48410.46000000002, 23604, 61870, 48316.5, 59755.5, 61240.15, 61866.49, 1.6131373909115838, 5062.190794329015, 18.241165426231227], "isController": true}, {"data": ["https://www.amry.ru/accessories/", 100, 0, 0.0, 2288.7700000000004, 852, 3489, 2400.0, 3061.9, 3230.95, 3488.7799999999997, 2.5607538859440218, 378.3968000179253, 1.3879086002919259], "isController": false}, {"data": ["https://www.amry.ru/tools/", 100, 0, 0.0, 2495.960000000001, 870, 4923, 2153.0, 4316.7, 4526.399999999999, 4920.419999999998, 2.6141740517083627, 494.2608412657177, 1.4015444867069249], "isController": false}, {"data": ["https://www.amry.ru/about/company/", 100, 50, 50.0, 1723.8399999999995, 328, 4430, 1237.5, 3453.300000000001, 3889.399999999999, 4429.24, 21.551724137931036, 1496.9671841325433, 10.62853582974138], "isController": false}, {"data": ["https://www.amry.ru/chemistry/avtohimiya/", 100, 28, 28.0, 4363.92, 69, 8197, 5344.0, 7443.6, 7782.5999999999985, 8196.95, 3.509510774198077, 550.0178285889134, 1.9151509967010598], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["503/Service Temporarily Unavailable", 267, 94.34628975265018, 12.714285714285714], "isController": false}, {"data": ["529/Internal Server Error", 16, 5.6537102473498235, 0.7619047619047619], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 2100, 283, "503/Service Temporarily Unavailable", 267, "529/Internal Server Error", 16, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["https://www.amry.ru/chemistry/avtohimiya/ochistiteli-dvigatelya-narujnie-hi-gear-hg5377.html", 100, 27, "503/Service Temporarily Unavailable", 27, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://www.amry.ru/stocks/", 100, 44, "503/Service Temporarily Unavailable", 44, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://www.amry.ru/chemistry/", 200, 23, "503/Service Temporarily Unavailable", 23, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://www.amry.ru/to_suppliers/", 100, 42, "503/Service Temporarily Unavailable", 42, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://www.amry.ru/accum/akkumulyator-6st---132-apz-bars-silver.html", 100, 22, "503/Service Temporarily Unavailable", 22, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://www.amry.ru/accum/", 100, 47, "503/Service Temporarily Unavailable", 31, "529/Internal Server Error", 16, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://www.amry.ru/about/company/", 100, 50, "503/Service Temporarily Unavailable", 50, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://www.amry.ru/chemistry/avtohimiya/", 100, 28, "503/Service Temporarily Unavailable", 28, "", "", "", "", "", "", "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
