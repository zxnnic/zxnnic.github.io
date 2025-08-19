const header_text = " zixin zhao zi xin zhao 赵 子 欣 z i x i n  z h a o zixin (nicole) zhao nicole (zixin) zhao zixin nicole zhao nicole zhao zixin zhao zi xin zhao 赵 子 欣 z i x i n  z h a o zixin (nicole) zhao nicole (zixin) zhao zixin nicole zhao nicole zhao zixin zhao zi xin zhao z i x i n  z h a o zixin (nicole) zhao nicole zhao zixin zhao zi xin zhao 赵 子 欣 z i x i n  z h a o zixin (nicole) zhao nicole (zixin) zhao zixin nicole zhao nicole zhao zixin zhao zi xin zhao z i x i n  z h a o zixin (nicole)";
const header = d3.select("#header");
const dur = 50

let i = 0;

function typeHeader() {
    
    if (i <= header_text.length) {
        header.text(header_text.substring(0, i));
        i++;
        setTimeout(typeHeader, 50);
    }
}

typeHeader();

$(document).ready(() => {
    console.log('woah')
    //////////////////////// Profile picture
    // Swivel image on hover for circle
    $('.circle').hover(
        function() {
            $(this).addClass('swivel');
        },
        function() {
            $(this).removeClass('swivel');
        }
    );

    ////////////////////////////////// Show papers
    d3.csv('papers.csv').then(function(data) {
        const container = d3.select('#all-research');
        const featuredContainer = d3.select('#featured-research');
        // Sort data in reverse order by id
        data.sort((a, b) => Number(b.id) - Number(a.id));

        // Populate featured-research with entries where feature=true
        featuredContainer.html("<h5>Recent Works</h5>");
        data.forEach(function(d) {
            if (d.feature && (d.feature === true || d.feature === "true")) {
                insertDataCol(featuredContainer, d);
            }
        });

        // Initial render: show all
        renderPapers();


        // Refactored filter logic using jQuery
        $('.btn-conf').on('click', function() {
            $('.btn-conf').removeClass('selected');
            $(this).addClass('selected');
            if (this.id === 'filter-all') {
                renderPapers();
            } else if (this.id === 'filter-nlp') {
                renderPapers(['acl']);
            } else if (this.id === 'filter-hci') {
                renderPapers(['chi', 'uist', 'misc', 'cc']);
            } else if (this.id === 'filter-vis') {
                renderPapers(['dis', 'vis']);
            }
        });

        // for all the papers
        function renderPapers(filterClasses) {
            console.log(this)
            container.selectAll('.paper-row').remove();
            data.forEach(function(d) {
                if (!filterClasses) {
                    insertDataRow(container, d)
                } else {
                    filterClasses.forEach((filterClass) => {
                        if (d.class.includes(filterClass)) {
                            insertDataRow(container, d)
                        }
                    })
                }
            });
        }
        // insert them one row at a time
        function insertDataRow(container, d) {
            console.log(d)
            let authors = d.authors || "";
            authors = authors.replace(/Zixin Zhao/g, '<span style="text-decoration:underline;font-style:italic;">Zixin Zhao</span>')
                             .replace(/Nicole Zhao/g, '<span style="text-decoration:underline;font-style:italic;">Nicole Zhao</span>');
            let links = ''
            if (d.demo_link !== '') {
                links += `<a href="${d.demo_link}" target="_blank">Project Page</a>&nbsp;|&nbsp;`;
            }
            links += `<a href="${d.paper_link}" target="_blank">Paper</a>&nbsp;|&nbsp;
                    <a href="${d.bibtext}" target="_blank">Bibtex</a>`;
            container.append('div').html(`
                <div class="row ${d.class} my-2 paper-row" id="paper-${d.id}">
                    <div class="col-12 col-md-3 d-none d-md-block">
                        <img src='${d.icon}' width="90%">
                    </div>
                    <div class="col-12 col-md-9">
                        <div class="row px-3">
                            <btn class="btn-${d.class} ">${d.conference}</div>
                            <div class="fw-bold px-1">${d.title}</div>
                            <div class="px-1">${authors}</div>
                            <div class="px-1 pt-2" style="font-size:small">${d.tldr}</div>
                            <div class="px-1 my-2">
                                ${links}
                            </div>
                        </div>
                    </div>
                </div>
            `);
        }
        // insert them vertically
        function insertDataCol(container, d) {
            const div = document.createElement('div');
            div.className = `col-12 col-md-4 ${d.class} my-3 paper-row`;
            div.id = `paper-${d.id}`;
            let authors = d.authors || "";
            authors = authors.replace(/Zixin Zhao/g, '<span style="text-decoration:underline;font-style:italic;">Zixin Zhao</span>')
                             .replace(/Nicole Zhao/g, '<span style="text-decoration:underline;font-style:italic;">Nicole Zhao</span>');
            let links = ''
            if (d.demo_link !== '') {
                links += `<a href="${d.demo_link}" target="_blank">Project Page</a>&nbsp;|&nbsp;`;
            }
            links += `<a href="${d.paper_link}" target="_blank">Paper</a>&nbsp;|&nbsp;
                    <a href="${d.bibtext}" target="_blank">Bibtex</a>`;
            div.innerHTML = `
                <div class="text-center" style="height:200px;padding:8px;display:flex;align-items:center;justify-content:center;">
                    <img src='${d.icon}' style="max-height:100%;max-width:200px;object-fit:contain;">
                </div>
                <div class="fw-bold px-1">${d.title}</div>
                <div class="px-1">${authors}</div>
                <div class="px-1 pt-2" style="font-size:small">${d.tldr}</div>
                <div class="px-1 my-1">${links}</div>
                <div class="px-1">@${d.conference}</div>
            `;
            container.node().appendChild(div);
        }
    });

    //////////////////////////////////////////////////////////
    // Funky image
    // List of random images
    const randomImages = [
        'dog1.gif', 
        'no_money.gif',
        'big_nose.gif',
        'guinea_pig.gif'
        // 'happy_holidays_snowflake_glitter.gif', 
    ];
    $('#surprise').on('click', function() {
        const idx = Math.floor(Math.random() * randomImages.length);
        const imgTag = `<img src='./images/random/${randomImages[idx]}' style='max-width:150px;height:100%;height:auto;'>`;
        $('#surprise-image').html(imgTag);
    });


    // //////////////////////////////////////////////////////////
    // // Wave on the bottom
    // const width = window.innerWidth;
    // const height = window.innerHeight;
    // d3.select('#waves')
    //   .attr('class', 'waves')
    //   .attr('width', width)
    //   .attr('height', height)
    //   .style('position', 'fixed')
    //   .style('top', 0)
    //   .style('left', 0)
    //   .style('z-index', 0)
    //   .style('pointer-events', 'none');

    // const svg = d3.select('.waves');

    // // Grass waves
    // const waveData = [
    //   { y: 0.9, color: '#a1d2ff', opacity: 0.05, amp: 35, freq: 2 },
    //   { y: 0.95, color: '#a1d2ff', opacity: 0.1, amp: 20, freq: 3 }
    // ];

    // waveData.forEach(wave => {
    //   const points = [];
    //   for (let x = 0; x <= width; x += 10) {
    //     const y = height * wave.y + Math.sin(x / width * Math.PI * wave.freq) * wave.amp;
    //     points.push([x, y]);
    //   }
    //   let path = `M0,${height} L0,${points[0][1]}`;
    //   points.forEach(([x, y]) => {
    //     path += ` L${x},${y}`;
    //   });
    //   path += ` L${width},${height} Z`;
    //   svg.append('path')
    //     .attr('d', path)
    //     .attr('fill', wave.color)
    //     .attr('opacity', wave.opacity);
    // });
});