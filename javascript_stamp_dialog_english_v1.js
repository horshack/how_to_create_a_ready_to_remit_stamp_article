// save context of the stamp-pdf to a variable
var mystamp = this;


console.println("event.source.stampName = " + event.source.stampName);
if (event.source.forReal && event.source.stampName == "#aFmkX0m3X7Q0X6UmM6vBb2") {
    app.execDialog(my_dialog());
}

function today_mmddyyyy() {
    var h = util.printd("dd.mm.yyyy", new Date());
    return h;
}

function amount_default() {
    return "0,00";
}

function costunit_possible_values() {
    return {
        "0601.5620 (training)": +100,
        "0601.6374 (service)": +99,
		"0601.5200 (small parts)": +98,
        "0601.9350 (machines)": +98
    }
}

function responsible_possible_values() {
    return {
		"Doe, John": +100,
		"Wendish, Kevin": +99,
		"Bull, Sandra": +98
    }
}

function find_costunit_from_dialog(dialog) {
	var items = dialog.store()["costunit"];
    var found_costunit = '';
	for (var item in items) {
        if (items[item] > 0) {
            console.println(item);
            found_costunit = item;
            break;
        }
    }
    // costunit has a comment in round brackets in the end
    // 1234 (misc) -> 1234
    found_costunit = found_costunit.replace(/\(.*$/, "");
    return found_costunit;
}

function find_responsible_from_dialog(dialog) {
	var items = dialog.store()["responsible"];
    var found_responsible = '';
	for (var item in items) {
        if (items[item] > 0) {
            console.println(item);
            found_responsible = item;
            break;
        }
    }
    return found_responsible;
}

function find_complete_part_from_dialog(dialog) {
    var active_text;

    // das sind Radio-Buttons
    const complete_partial_mapper = {
        "radio_part": "Part only",
        "radio_complete": "Complete Pay"
    };

    for (var key in complete_partial_mapper) {
        var sa = dialog.store()[key];
        if (! sa) {
            continue;
        }
        active_text = complete_partial_mapper[key];
        break;
    }
    return active_text;
}

function currency() {
    return "€";
}

function purpose_default() {
    return "";
}

function determine_purpose_text_from_dialog(dialog) {
    var purpose = "(no purpose)";
    if (dialog.store()["purpose"]) {
        purpose = dialog.store()["purpose"];
    }
    return purpose;
}

function my_dialog() {
    var dialog = {
        initialize: function(dialog) {
            dialog.load({
                "readydate": today_mmddyyyy(),
                "responsible": responsible_possible_values(),
                "costunit": costunit_possible_values(),
                "amount": amount_default(),
                "purpose": purpose_default()
            });
        },
        commit: function(dialog) { // called when OK pressed
            var results = dialog.store();

            // Eintragen der Daten aus dem Dialogfeld in das PDF
            mystamp.getField("txt_costunit").value = find_costunit_from_dialog(dialog);
            mystamp.getField("txt_amount").value = results["amount"] + " " + currency();
            mystamp.getField("txt_purpose").value = determine_purpose_text_from_dialog(dialog);
            mystamp.getField("txt_date").value = results["readydate"];
            mystamp.getField("txt_complete_part").value = find_complete_part_from_dialog(dialog);
            mystamp.getField("txt_responsible").value = find_responsible_from_dialog(dialog);
            mystamp.getField("txt_readytoremit").value = "Ready to remit!";
        },
        description: {
            name: "Ready to remit money", // Dialog box title
            align_children: "align_left",
            width: 350,
            height: 200,
            elements: [{
                    type: "cluster",
                    name: "The details",
                    align_children: "align_left",
                    elements: [
                        {
                            type: "view",
                            align_children: "align_row",
                            elements: [
                                {
                                    type: "static_text",
                                    name: "Purpose: "
                                },
                                {
                                    type: "gap",
                                    width: 28,
                                },
                                {
                                    item_id: "purpose",
                                    type: "edit_text",
                                    alignment: "align_fill",
                                    width: 100,
                                    height: 20
                                }
                            ]
                        },
                        {
                            type: "view",
                            align_children: "align_row",
                            elements: [
                                {
                                    type: "static_text",
                                    name: "Cost unit: "
                                },
                                {
                                    type: "gap",
                                    width: 58,
                                },
                                {
                                    item_id: "costunit",
                                    type: "popup",
                                    alignment: "align_fill",
                                    width: 200,
                                    height: 20
                                }
                            ]
                        },
                        {
                            type: "view",
                            align_children: "align_row",
                            elements: [
                                {
                                    type: "static_text",
                                    name: "Complete/Part:"
                                },
                                {
                                    type: "gap",
                                    width: 24,
                                },
                                {
                                type: "radio",
                                group_id: "complete_part",
                                item_id: "radio_complete",
                                name: "Complete Pay",
                                },
                                {
                                type: "radio",
                                group_id: "complete_part",
                                item_id: "radio_part",
                                name: "Partial Pay",
                                },

                            ]
                        },
                        {
                            type: "view",
                            align_children: "align_row",
                            elements: [
                                {
                                    type: "static_text",
                                    name: "Amount: "
                                },
                                {
                                    type: "gap",
                                    width: 28,
                                },
                                {
                                    item_id: "amount",
                                    type: "edit_text",
                                    alignment: "align_fill",
                                    width: 100,
                                    height: 20
                                },
                                {
                                    type: "static_text",
                                    name: "Euro"
                                }
                            ]
                        },
                        {
                            type: "view",
                            align_children: "align_row",
                            elements: [
                                {
                                    type: "static_text",
                                    name: "Date: "
                                },
                                {
                                    type: "gap",
                                    width: 50,
                                },
                                {
                                    item_id: "readydate",
                                    type: "edit_text",
                                    alignment: "align_left",
                                    width: 100,
                                    height: 20
                                }
                            ]
                        },
                        {
                            type: "view",
                            align_children: "align_row",
                            elements: [
                                {
                                    type: "static_text",
                                    name: "Responsible: "
                                },
                                {
                                    item_id: "responsible",
                                    type: "popup",
                                    alignment: "align_fill",
                                    width: 200,
                                    height: 20
                                }
                            ]
                        },

                    ]
                },
                {
                    alignment: "align_right",
                    type: "ok_cancel",
                    ok_name: "Ok",
                    cancel_name: "Cancel"
                }
            ]
        }
    };
    return dialog;
}
