// switch out to d3
// thumbnail to youtube link in separate page
// bubble thing on top of title
// youtube video thumbnail in the highlighted ones
// 



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
    //////////////////////// Profile picture
    // Fade front/back images on hover instead of swivel
    $('.circle').each(function() {
        const $c = $(this);
        const $front = $c.find('.front');
        const $back = $c.find('.back');
        // ensure starting state
        $front.css('opacity', 1);
        $back.css('opacity', 0);
        $c.on('mouseenter', function() {
            $front.stop(true, true).fadeTo(200, 0);
            $back.stop(true, true).fadeTo(200, 1);
        }).on('mouseleave', function() {
            $front.stop(true, true).fadeTo(200, 1);
            $back.stop(true, true).fadeTo(200, 0);
        });
    });

    ////////////////////////////////// Show papers
    // Create a lightweight modal for displaying Bibtex
    if ($('#bib-modal').length === 0) {
        $('body').append(`
            <div id="bib-modal" style="display:none;">
                <div class="bib-overlay"></div>
                <div class="bib-box">
                    <button class="bib-close" aria-label="Close">&times;</button>
                    <pre class="bib-content"></pre>
                </div>
            </div>
        `);
    }

    // Delegated handler for bib links
    $(document).on('click', '.bib-link', function(e) {
        e.preventDefault();
        const encoded = $(this).attr('data-bib') || '';
        const bib = decodeURIComponent(encoded);
        $('#bib-modal .bib-content').text(bib);
        $('#bib-modal').fadeIn(150);
    });

    // Close handlers
    $(document).on('click', '#bib-modal .bib-close, #bib-modal .bib-overlay', function() {
        $('#bib-modal').fadeOut(120);
    });
    $.get('papers.csv', function(csvString) {
        const result = Papa.parse(csvString, { header: true });
        const data = result.data;

        // Sort data in reverse order by id
        data.sort((a, b) => Number(b.id) - Number(a.id));

        // Populate featured-research with entries where feature=true (case-insensitive)
        $('#featured-research').html("<h5>Recent Works</h5>");
        data.forEach(function(d) {
            if (d.feature && (d.feature === true || String(d.feature).toLowerCase() === "true")) {
                insertDataCol($('#featured-research'), d);
            }
        });

        // Initial render: show all
        renderPapers();


        // Refactored filter logic using jQuery
        $('.btn-conf-filter').on('click', function() {
            $('.btn-conf-filter').removeClass('selected');
            $(this).addClass('selected');
            if (this.id === 'filter-all') {
                renderPapers();
            } else if (this.id === 'filter-nlp') {
                renderPapers(['nlp']);
            } else if (this.id === 'filter-hci') {
                renderPapers(['hci']);
            } else if (this.id === 'filter-vis') {
                renderPapers(['vis']);
            }
        });

        // for all the papers
        function renderPapers(filterClasses) {
            $('#all-research').find('.paper-row').remove();
            data.forEach(function(d) {
                if (!filterClasses) {
                    insertDataRow($('#all-research'), d)
                } else {
                    filterClasses.forEach((filterClass) => {
                        if (d.class.includes(filterClass)) {
                            insertDataRow($('#all-research'), d)
                        }
                    })
                }
            });
        }
        // insert them one row at a time
        function insertDataRow(container, d) {
            if (!d.authors) return
            let authors = d.authors || "";
            authors = authors.replace(/Zixin Zhao/g, '<span class="circle-me" style="text-decoration:underline;font-style:italic;">Zixin Zhao</span>')
                             .replace(/Nicole Zhao/g, '<span class="circle-me" style="text-decoration:underline;font-style:italic;">Nicole Zhao</span>');
            let links = ''
            if (d.demo_link !== '') {
                links += `<a href="${d.demo_link}" target="_blank">Project Page</a>&nbsp;|&nbsp;`;
            }
            // Clean bibtext: remove surrounding double quotes if present
            const _bibRawCol = d.bibtext || '';
            const _bibCleanCol = _bibRawCol.trim().replace(/^"/, '').replace(/"$/, '');
            links += `<a href="${d.paper_link}" target="_blank">Paper</a>&nbsp;|&nbsp;<a href="#" class="bib-link" data-bib="${encodeURIComponent(_bibCleanCol)}">Bibtex</a>`;

            const paperHtml = `
                <div class="row ${d.class} my-2 paper-row" id="paper-${d.id}">
                    <div class="col-12 col-md-3 d-none d-md-block" style="max-width:150px;height:100%;">
                        <img src='${d.icon}' width="150px" 
                            onmouseover="this.src='${d.icon_moving}'"
                            onmouseout="this.src='${d.icon}'"
                        />
                    </div>
                    <div class="col-12 col-md-9">
                        <div class="row px-3">
                            <btn class="btn-${d.class} mx-2">${d.conference}</btn>
                            <div class="fw-bold px-1 mx-2">${d.title}</div>
                            <div class="px-1 mx-2">${authors}</div>
                            <div class="px-1 pt-2 mx-2" style="font-size:small">${d.tldr}</div>
                            <div class="px-1 my-2 mx-2">
                                ${links}
                            </div>
                        </div>
                    </div>
                </div>
            `;

            container.append(paperHtml);

            // Add image hover effect after appending
            container.find(`#paper-${d.id} img`).hover(
            function() {
                if (d.icon_moving && d.icon_moving !== '') $(this).attr('src', d.icon_moving);
            },
            function() {
                $(this).attr('src', d.icon);
            }
            );

        }
        // insert them vertically
        function insertDataCol(container, d) {
            let authors = d.authors || "";
            authors = authors.replace(/Zixin Zhao/g, '<span class="circle-me" style="text-decoration:underline;font-style:italic;">Zixin Zhao</span>')
                             .replace(/Nicole Zhao/g, '<span class="circle-me" style="text-decoration:underline;font-style:italic;">Nicole Zhao</span>');
            let links = '';
            if (d.demo_link !== '') {
                links += `<a href="${d.demo_link}" target="_blank">Project Page</a>&nbsp;|&nbsp;`;
            }
            // Clean bibtext: remove surrounding double quotes if present
            const _bibRawCol = d.bibtext || '';
            const _bibCleanCol = _bibRawCol.trim().replace(/^"/, '').replace(/"$/, '');
            links += `<a href="${d.paper_link}" target="_blank">Paper</a>&nbsp;|&nbsp;<a href="#" class="bib-link" data-bib="${encodeURIComponent(_bibCleanCol)}">Bibtex</a>`;

            const paperHtml = `
            <div class="col-12 col-md-4 ${d.class} my-3 paper-row" id="paper-${d.id}">
                <div class="text-center icon-img" style="height:200px; padding:8px; display:flex; align-items:center; justify-content:center;">
                <img src="${d.icon}" style="max-height:100%; max-width:200px; object-fit:contain;">
                </div>
                <div><btn class="btn-${d.class}">${d.conference}</btn></div>
                <div class="fw-bold px-1">${d.title}</div>
                <div class="px-1">${authors}</div>
                <div class="px-1 pt-2" style="font-size:small">${d.tldr}</div>
                <div class="px-1 my-1">${links}</div>
                
            </div>
            `;

            container.append(paperHtml);

            // Add image hover effect after appending
            container.find(`#paper-${d.id} img`).hover(
            function() {
                if (d.icon_moving && d.icon_moving !== '') $(this).attr('src', d.icon_moving);
            },
            function() {
                $(this).attr('src', d.icon);
            }
            );
        }
    });


    // //////////////////////////////////////////////////////////
    // // Funky image
    // // List of random images
    // const randomImages = [
    //     'dog1.gif', 
    //     'no_money.gif',
    //     'big_nose.gif',
    //     'guinea_pig.gif'
    //     // 'happy_holidays_snowflake_glitter.gif', 
    // ];
    // $('#surprise').on('click', function() {
    //     const idx = Math.floor(Math.random() * randomImages.length);
    //     const imgTag = `<img src='./images/random/${randomImages[idx]}' style='max-width:150px;height:100%;height:auto;'>`;
    //     $('#surprise-image').html(imgTag);
    // });

    // Sketchy circle overlay for elements with class `circle-me`.
    (function initSketchyCircle(){
        const DPR = window.devicePixelRatio || 1;

        function createCanvasFor(el){
            const rect = el.getBoundingClientRect();
            const pad = 10;
            // ellipse dimensions: width = element width + 10, height = element height + 5
            const elemW = Math.max(16, Math.round(rect.width + 35));
            const elemH = Math.max(16, Math.round(rect.height + 25));
            const canvasW = Math.round(elemW + pad*2);
            const canvasH = Math.round(elemH + pad*2);
            const canvas = document.createElement('canvas');
            canvas.className = 'circle-overlay';
            // Position the canvas so the ellipse is centered on the element
            const left = rect.left + window.scrollX - pad - 15;
            const top = rect.top + window.scrollY - pad - 15;
            canvas.style.left = left + 'px';
            canvas.style.top = top + 'px';
            canvas.style.width = canvasW + 'px';
            canvas.style.height = canvasH + 'px';
            canvas.width = Math.round(canvasW * DPR);
            canvas.height = Math.round(canvasH * DPR);
            const ctx = canvas.getContext('2d');
            ctx.scale(DPR, DPR);
            return {canvas, ctx, w: canvasW, h: canvasH, pad, rect, elemW, elemH};
        }

        function drawSketch(ctx, w, h, opts, elemW, elemH, progress, rotationRad){
            ctx.clearRect(0,0,w,h);
            const cx = w/2;
            const cy = h/2;
            // ellipse radii based on element size (half widths)
            const rx = Math.max(3, elemW/2 - opts.pad);
            const ry = Math.max(3, elemH/2 - opts.pad);
            ctx.lineWidth = 1;
            ctx.lineCap = 'round';
            ctx.strokeStyle = 'rgba(224, 82, 94, 0.53)';

            // start at top (90deg = -PI/2) and render clockwise
            const startAngle = -Math.PI/2; // top
            const total = 2 * Math.PI;
            const endAngle = startAngle + total * Math.max(0, Math.min(1, progress));

            // Draw the progressive main loop (clockwise)
            ctx.beginPath();
            if (ctx.ellipse) ctx.ellipse(cx, cy, rx, ry, rotationRad, startAngle, endAngle, false);
            else ctx.arc(cx, cy, Math.max(1, (rx+ry)/2), startAngle, endAngle, false);
            ctx.stroke();

            // subtle secondary stroke after fully drawn for slight sketchiness
            if (progress >= 1) {
                const jitter = opts.jitter || 1.2;
                ctx.beginPath();
                const ox = (Math.random()-0.5) * jitter;
                const oy = (Math.random()-0.5) * jitter;
                const orx = rx + (Math.random()-0.5) * (jitter*0.6);
                const ory = ry + (Math.random()-0.5) * (jitter*0.6);
                const rot = rotationRad + (Math.random()-0.5) * 0.03;
                if (ctx.ellipse) ctx.ellipse(cx+ox, cy+oy, orx, ory, rot, 0, Math.PI*2);
                else ctx.arc(cx+ox, cy+oy, Math.max(1, (orx+ory)/2), 0, Math.PI*2);
                ctx.globalAlpha = 0.95;
                ctx.stroke();
                ctx.globalAlpha = 1;
            }
        }

        const active = new WeakMap();

        function start(el){
            if (active.has(el)) return;
            const color = '#4e4e4e';
            const {canvas, ctx, w, h, pad, elemW, elemH, rect} = createCanvasFor(el);
            document.body.appendChild(canvas);
            let rafId = null;
            const duration = 360; // ms to draw the main loop
            const opts = {pad: pad, lineWidth: 2, jitter: 1.2, color: color};
            const rotationRad = -6 * Math.PI / 180;
            const startTime = performance.now();
            function frame(now){
                const t = now || performance.now();
                const progress = Math.min(1, (t - startTime) / duration);
                drawSketch(ctx, w, h, opts, elemW, elemH, progress, rotationRad);
                rafId = requestAnimationFrame(frame);
            }
            frame();
            active.set(el, {canvas, rafId});
        }

        function stop(el){
            const v = active.get(el);
            if (!v) return;
            cancelAnimationFrame(v.rafId);
            if (v.canvas && v.canvas.parentNode) v.canvas.parentNode.removeChild(v.canvas);
            active.delete(el);
        }

        // Delegate enter/leave so dynamically added elements work too
        document.addEventListener('mouseover', function(e){
            const el = e.target.closest && e.target.closest('.circle-me');
            if (el) start(el);
        });
        document.addEventListener('mouseout', function(e){
            const el = e.target.closest && e.target.closest('.circle-me');
            if (el) stop(el);
        });
    })();
});