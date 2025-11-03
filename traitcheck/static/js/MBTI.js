$(document).ready(function () {

    var answers = [];

    // Get questions
    $.ajax({
        type: "get",
        url: `./data/output.txt`,
        async: false,
        success: function (data) {
            var data = JSON.parse(data);
            data.forEach((item, index) => {
                let display = index === 0 ? "block" : "none";

                $("#mbtiquestion").append(`
                    <form class="ac-custom ac-radio ac-circle" autocomplete="off" style="display: ${display}">
                        <h2>${index + 1}.${item.question}</h2>
                        <ul>
                            <li>
                                <input id="choice_a" name="answer" value="${item.choice_a.value}" type="radio">
                                    <label for="choice_a">
                                        ${item.choice_a.text}
                                    </label>
                                    <svg viewBox="0 0 100 100"></svg>
                            <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"></svg></li>
                            <li>
                                <input id="choice_b" name="answer" value="${item.choice_b.value}" type="radio">
                                    <label for="choice_b">
                                        ${item.choice_b.text}
                                    </label>
                                    <svg viewBox="0 0 100 100"></svg>
                            <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"></svg></li>
                        </ul>
                    </form>`
                );
            })

            // Wait for page rendering to complete before inserting svgcheckbx.js
            $("body").append("<script src='./static/js/svgcheckbx.js'></script>");
        }
    });


    $("input[name='answer']").on("change", function () {
        var answer = $(this).val();
        answers.push(answer);

        var form = $(this).parent().parent().parent();
        var next_form = form.next();
        setTimeout(function () {
            form.remove();
            next_form.css("display", "block");
        }, 520);
        if (answers.length == 93) {
            var page = ObtainingAnswers(answers)

            window.location.href = `./personalities/${page}.html`;
        }

    })

    function ObtainingAnswers(answer_list) {
        // Check if answer list is empty
        if (answer_list.length === 0) {
            alert('ValueError: answer list is empty')
            return;
        }
        // Check if answer list contains valid types
        const valid_types = ['E', 'I', 'S', 'N', 'T', 'F', 'J', 'P']
        answer_list.forEach((item) => {
            if (!valid_types.includes(item)) {
                alert('TypeError: answer type is not in valid types')
                return;
            }
        })
        // Use reduce method to count the number of each type of answer
        const counts = answer_list.reduce((acc, cur) => {
            acc[cur] = (acc[cur] || 0) + 1
            return acc
        }, {})
        // Use get_result function to calculate the result
        const types = [['E', 'I'], ['S', 'N'], ['T', 'F'], ['J', 'P']]
        const result = types.map(t => counts[t[0]] > counts[t[1]] ? t[0] : t[1]).join('')

        return result
    }
});

