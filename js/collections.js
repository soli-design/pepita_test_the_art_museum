_advSearchPanel_open = false;

function toggleAdvSearchPanel(e){
    e.stopPropagation();

    advSearchPanel.classList.toggle('open');
    _advSearchPanel_open = !_advSearchPanel_open;
}
