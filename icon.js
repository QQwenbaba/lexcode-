Blockly.FieldDropdown = function(e, t) {
    this.menuGenerator_ = e,
    this.trimOptions_(),
    e = this.getOptions()[0],
    Blockly.FieldDropdown.superClass_.constructor.call(this, e[1], t),
    this.addArgType("dropdown")
}
,
goog.inherits(Blockly.FieldDropdown, Blockly.Field),
Blockly.FieldDropdown.fromJson = function(e) {
    return new Blockly.FieldDropdown(e.options)
}
,
Blockly.FieldDropdown.CHECKMARK_OVERHANG = 25,
Blockly.FieldDropdown.prototype.CURSOR = "default",
Blockly.FieldDropdown.prototype.selectedItem = null,
Blockly.FieldDropdown.prototype.value_ = "",
Blockly.FieldDropdown.prototype.imageElement_ = null,
Blockly.FieldDropdown.prototype.imageJson_ = null,
Blockly.FieldDropdown.prototype.init = function() {
    if (!this.fieldGroup_) {
        this.arrowSize_ = 12,
        this.arrowX_ = 0,
        this.arrowY_ = 11,
        this.arrow_ = Blockly.utils.createSvgElement("image", {
            height: this.arrowSize_ + "px",
            width: this.arrowSize_ + "px"
        }),
        this.arrow_.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", Blockly.mainWorkspace.options.pathToMedia + "dropdown-arrow.svg"),
        this.className_ += " blocklyDropdownText",
        Blockly.FieldDropdown.superClass_.init.call(this),
        this.sourceBlock_.isShadow() || (this.box_ = Blockly.utils.createSvgElement("rect", {
            rx: Blockly.BlockSvg.CORNER_RADIUS,
            ry: Blockly.BlockSvg.CORNER_RADIUS,
            x: 0,
            y: 0,
            width: this.size_.width,
            height: this.size_.height,
            stroke: this.sourceBlock_.getColourTertiary(),
            fill: this.sourceBlock_.getColour(),
            class: "blocklyBlockBackground",
            "fill-opacity": 1
        }, null),
        this.fieldGroup_.insertBefore(this.box_, this.textElement_));
        var e = this.text_;
        this.text_ = null,
        this.setText(e)
    }
}
,
Blockly.FieldDropdown.prototype.showEditor_ = function() {
    var e = this.getOptions();
    if (0 != e.length) {
        this.dropDownOpen_ = !0,
        Blockly.DropDownDiv.hideWithoutAnimation(),
        Blockly.DropDownDiv.clearContent();
        var t = Blockly.DropDownDiv.getContentDiv()
          , n = this
          , r = new goog.ui.Menu;
        r.setRightToLeft(this.sourceBlock_.RTL);
        for (var o = 0; o < e.length; o++) {
            var i = e[o][0]
              , a = e[o][1];
            if ("object" == typeof i) {
                var s = new Image(i.width,i.height);
                s.src = i.src,
                s.alt = i.alt || "",
                i = s
            }
            (i = new goog.ui.MenuItem(i)).setRightToLeft(this.sourceBlock_.RTL),
            i.setValue(a),
            i.setCheckable(!0),
            r.addChild(i, !0),
            a = a == this.value_,
            i.setChecked(a),
            a && (this.selectedItem = i)
        }
        goog.events.listen(r, goog.ui.Component.EventType.ACTION, function(e) {
            (e = e.target) && n.onItemSelected(this, e),
            Blockly.DropDownDiv.hide(),
            Blockly.Events.setGroup(!1)
        }),
        r.render(t),
        e = r.getElement(),
        Blockly.utils.addClass(e, "blocklyDropdownMenu"),
        goog.style.getSize(e).height = e.scrollHeight,
        t = this.sourceBlock_.isShadow() ? this.sourceBlock_.parentBlock_.getColour() : this.sourceBlock_.getColour(),
        Blockly.DropDownDiv.setColour(t, this.sourceBlock_.getColourTertiary()),
        t = this.sourceBlock_.isShadow() ? this.sourceBlock_.parentBlock_.getCategory() : this.sourceBlock_.getCategory(),
        Blockly.DropDownDiv.setCategory(t),
        o = this.sourceBlock_.workspace.scale,
        a = this.size_.width,
        t = this.size_.height,
        a *= o,
        t *= o,
        a = (o = this.fieldGroup_.getBoundingClientRect()).left + a / 2,
        t = o.top + t,
        o = o.top,
        Blockly.DropDownDiv.setBoundsElement(this.sourceBlock_.workspace.getParentSvg().parentNode),
        Blockly.DropDownDiv.show(this, a, t, a, o, this.onHide.bind(this)),
        r.setAllowAutoFocus(!0),
        e.focus(),
        this.disableColourChange_ || (this.sourceBlock_.isShadow() ? this.sourceBlock_.setShadowColour(this.sourceBlock_.getColourTertiary()) : this.box_ && this.box_.setAttribute("fill", this.sourceBlock_.getColourTertiary()))
    }
}
,
Blockly.FieldDropdown.prototype.onHide = function() {
    this.dropDownOpen_ = !1,
    !this.disableColourChange_ && this.sourceBlock_ && (this.sourceBlock_.isShadow() ? this.sourceBlock_.clearShadowColour() : this.box_ && this.box_.setAttribute("fill", this.sourceBlock_.getColour()))
}
,
Blockly.FieldDropdown.prototype.onItemSelected = function(e, t) {
    e = t.getValue(),
    this.sourceBlock_ && (e = this.callValidator(e)),
    "function" == typeof e ? e() : null !== e && this.setValue(e)
}
,
Blockly.FieldDropdown.prototype.trimOptions_ = function() {
    this.suffixField = this.prefixField = null;
    var e = this.menuGenerator_;
    if (goog.isArray(e)) {
        for (var t = !1, n = 0; n < e.length; n++) {
            var r = e[n][0];
            "string" == typeof r ? e[n][0] = Blockly.utils.replaceMessageReferences(r) : (null != r.alt && (e[n][0].alt = Blockly.utils.replaceMessageReferences(r.alt)),
            t = !0)
        }
        if (!(t || 2 > e.length)) {
            var o = [];
            for (n = 0; n < e.length; n++)
                o.push(e[n][0]);
            if (n = Blockly.utils.shortestStringLength(o),
            t = Blockly.utils.commonWordPrefix(o, n),
            r = Blockly.utils.commonWordSuffix(o, n),
            (t || r) && !(n <= t + r)) {
                for (t && (this.prefixField = o[0].substring(0, t - 1)),
                r && (this.suffixField = o[0].substr(1 - r)),
                o = [],
                n = 0; n < e.length; n++) {
                    var i = e[n][0]
                      , a = e[n][1];
                    i = i.substring(t, i.length - r),
                    o[n] = [i, a]
                }
                this.menuGenerator_ = o
            }
        }
    }
}
,
Blockly.FieldDropdown.prototype.isOptionListDynamic = function() {
    return goog.isFunction(this.menuGenerator_)
}
,
Blockly.FieldDropdown.prototype.getOptions = function() {
    return goog.isFunction(this.menuGenerator_) ? this.menuGenerator_.call(this) : this.menuGenerator_
}
,
Blockly.FieldDropdown.prototype.getValue = function() {
    return this.value_
}
,
Blockly.FieldDropdown.prototype.setValue = function(e) {
    if (null !== e && e !== this.value_) {
        this.sourceBlock_ && Blockly.Events.isEnabled() && Blockly.Events.fire(new Blockly.Events.BlockChange(this.sourceBlock_,"field",this.name,this.value_,e)),
        this.selectedItem && (this.selectedItem.setChecked(!1),
        this.selectedItem = null),
        this.value_ = e;
        for (var t = this.getOptions(), n = 0; n < t.length; n++)
            if (t[n][1] == e)
                return "object" == typeof (e = t[n][0]) ? (this.imageJson_ = e,
                this.text_ = e.alt) : (this.imageJson_ = null,
                this.text_ = e),
                void this.forceRerender();
        this.text_ = e,
        this.forceRerender()
    }
}
,
Blockly.FieldDropdown.prototype.setText = function(e) {
    null !== e && e !== this.text_ && (this.text_ = e,
    this.updateTextNode_(),
    this.textElement_ && this.textElement_.parentNode.appendChild(this.arrow_),
    this.sourceBlock_ && this.sourceBlock_.rendered && (this.sourceBlock_.render(),
    this.sourceBlock_.bumpNeighbours_()))
}
,
Blockly.FieldDropdown.prototype.positionArrow = function(e) {
    return this.arrow_ ? (this.arrowX_ = this.sourceBlock_.RTL ? this.arrowSize_ - Blockly.BlockSvg.DROPDOWN_ARROW_PADDING : e + Blockly.BlockSvg.DROPDOWN_ARROW_PADDING / 2,
    e = this.arrowSize_ + Blockly.BlockSvg.DROPDOWN_ARROW_PADDING,
    this.box_ && (this.arrowX_ += Blockly.BlockSvg.BOX_FIELD_PADDING),
    this.arrow_.setAttribute("transform", "translate(" + this.arrowX_ + "," + this.arrowY_ + ")"),
    e) : 0
}
,
Blockly.FieldDropdown.prototype.dispose = function() {
    this.selectedItem = null,
    Blockly.WidgetDiv.hideIfOwner(this),
    Blockly.FieldDropdown.superClass_.dispose.call(this)
}
,
Blockly.Field.register("field_dropdown", Blockly.FieldDropdown),
Blockly.FieldIconMenu = function(e) {
    this.icons_ = e,
    Blockly.FieldIconMenu.superClass_.constructor.call(this, e[0].value),
    this.addArgType("iconmenu")
}
,
goog.inherits(Blockly.FieldIconMenu, Blockly.Field),
Blockly.FieldIconMenu.fromJson = function(e) {
    return new Blockly.FieldIconMenu(e.options)
}
,
Blockly.FieldIconMenu.DROPDOWN_WIDTH = 168,
Blockly.FieldIconMenu.savedPrimary_ = null,
Blockly.FieldIconMenu.prototype.init = function(e) {
    this.fieldGroup_ || (this.arrowX_ = 18,
    this.arrowY_ = 10,
    e.RTL && (this.arrowX_ = -this.arrowX_ - 12),
    this.arrowIcon_ = Blockly.utils.createSvgElement("image", {
        height: "12px",
        width: "12px",
        transform: "translate(" + this.arrowX_ + "," + this.arrowY_ + ")"
    }),
    this.arrowIcon_.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", Blockly.mainWorkspace.options.pathToMedia + "dropdown-arrow.svg"),
    e.getSvgRoot().appendChild(this.arrowIcon_),
    Blockly.FieldIconMenu.superClass_.init.call(this, e))
}
,
Blockly.FieldIconMenu.prototype.CURSOR = "default",
Blockly.FieldIconMenu.prototype.setValue = function(e) {
    null !== e && e !== this.value_ && (this.sourceBlock_ && Blockly.Events.isEnabled() && Blockly.Events.fire(new Blockly.Events.Change(this.sourceBlock_,"field",this.name,this.value_,e)),
    this.value_ = e,
    this.setParentFieldImage(this.getSrcForValue(this.value_)))
}
,
Blockly.FieldIconMenu.prototype.setParentFieldImage = function(e) {
    if (this.sourceBlock_ && this.sourceBlock_.parentBlock_)
        for (var t, n = this.sourceBlock_.parentBlock_, r = 0; t = n.inputList[r]; r++)
            for (var o, i = 0; o = t.fieldRow[i]; i++)
                if (o instanceof Blockly.FieldImage)
                    return void o.setValue(e)
}
,
Blockly.FieldIconMenu.prototype.getValue = function() {
    return this.value_
}
,
Blockly.FieldIconMenu.prototype.getSrcForValue = function(e) {
    for (var t, n = 0; t = this.icons_[n]; n++)
        if (t.value === e)
            return t.src
}
,
Blockly.FieldIconMenu.prototype.showEditor_ = function() {
    if (!Blockly.DropDownDiv.hideIfOwner(this)) {
        Blockly.DropDownDiv.hideWithoutAnimation(),
        Blockly.DropDownDiv.clearContent();
        var e = Blockly.DropDownDiv.getContentDiv();
        e.setAttribute("role", "menu"),
        e.setAttribute("aria-haspopup", "true");
        for (var t, n = 0; t = this.icons_[n]; n++)
            if ("placeholder" == t.type) {
                var r = document.createElement("span");
                r.setAttribute("class", "blocklyDropDownPlaceholder"),
                r.style.width = t.width + "px",
                r.style.height = t.height + "px",
                e.appendChild(r)
            } else {
                (r = document.createElement("button")).setAttribute("id", ":" + n),
                r.setAttribute("role", "menuitem"),
                r.setAttribute("class", "blocklyDropDownButton"),
                r.title = t.alt,
                r.style.width = t.width + "px",
                r.style.height = t.height + "px";
                var o = this.sourceBlock_.getColour();
                t.value == this.getValue() && (o = this.sourceBlock_.getColourTertiary(),
                r.setAttribute("aria-selected", "true")),
                r.style.backgroundColor = o,
                r.style.borderColor = this.sourceBlock_.getColourTertiary(),
                Blockly.bindEvent_(r, "click", this, this.buttonClick_),
                Blockly.bindEvent_(r, "mouseup", this, this.buttonClick_),
                Blockly.bindEvent_(r, "mousedown", r, function(e) {
                    this.setAttribute("class", "blocklyDropDownButton blocklyDropDownButtonHover"),
                    e.preventDefault()
                }),
                Blockly.bindEvent_(r, "mouseover", r, function() {
                    this.setAttribute("class", "blocklyDropDownButton blocklyDropDownButtonHover"),
                    e.setAttribute("aria-activedescendant", this.id)
                }),
                Blockly.bindEvent_(r, "mouseout", r, function() {
                    this.setAttribute("class", "blocklyDropDownButton"),
                    e.removeAttribute("aria-activedescendant")
                }),
                (o = document.createElement("img")).src = t.src,
                r.setAttribute("data-value", t.value),
                o.setAttribute("data-value", t.value),
                r.appendChild(o),
                e.appendChild(r)
            }
        e.style.width = Blockly.FieldIconMenu.DROPDOWN_WIDTH + "px",
        Blockly.DropDownDiv.setColour(this.sourceBlock_.getColour(), this.sourceBlock_.getColourTertiary()),
        Blockly.DropDownDiv.setCategory(this.sourceBlock_.parentBlock_.getCategory()),
        this.savedPrimary_ = this.sourceBlock_.getColour(),
        this.sourceBlock_.setColour(this.sourceBlock_.getColourSecondary(), this.sourceBlock_.getColourSecondary(), this.sourceBlock_.getColourTertiary()),
        n = this.sourceBlock_.workspace.scale,
        n = -Blockly.BlockSvg.MIN_BLOCK_Y * n - Blockly.BlockSvg.FIELD_Y_OFFSET * n,
        Blockly.DropDownDiv.showPositionedByBlock(this, this.sourceBlock_, this.onHide_.bind(this), n) || this.arrowIcon_.setAttribute("transform", "translate(" + (this.arrowX_ + Blockly.DropDownDiv.ARROW_SIZE / 1.5 + 1) + "," + (this.arrowY_ + Blockly.DropDownDiv.ARROW_SIZE / 1.5) + ") rotate(180)")
    }
}
,
Blockly.FieldIconMenu.prototype.buttonClick_ = function(e) {
    e = e.target.getAttribute("data-value"),
    this.setValue(e),
    Blockly.DropDownDiv.hide()
}
,
Blockly.FieldIconMenu.prototype.onHide_ = function() {
    this.sourceBlock_ && this.sourceBlock_.setColour(this.savedPrimary_, this.sourceBlock_.getColourSecondary(), this.sourceBlock_.getColourTertiary()),
    Blockly.DropDownDiv.content_.removeAttribute("role"),
    Blockly.DropDownDiv.content_.removeAttribute("aria-haspopup"),
    Blockly.DropDownDiv.content_.removeAttribute("aria-activedescendant"),
    this.arrowIcon_.setAttribute("transform", "translate(" + this.arrowX_ + "," + this.arrowY_ + ")")
}
,
Blockly.Field.register("field_iconmenu", Blockly.FieldIconMenu),
Blockly.FieldImage = function(e, t, n, r, o) {
    this.sourceBlock_ = null,
    this.height_ = Number(n),
    this.width_ = Number(t),
    this.size_ = new goog.math.Size(this.width_,this.height_),
    this.text_ = r || "",
    this.flipRTL_ = o,
    this.setValue(e)
}
,
goog.inherits(Blockly.FieldImage, Blockly.Field),
Blockly.FieldImage.fromJson = function(e) {
    var t = Blockly.utils.replaceMessageReferences(e.src)
      , n = Number(Blockly.utils.replaceMessageReferences(e.width))
      , r = Number(Blockly.utils.replaceMessageReferences(e.height))
      , o = Blockly.utils.replaceMessageReferences(e.alt);
    return new Blockly.FieldImage(t,n,r,o,!!e.flip_rtl || !!e.flipRtl)
}
,
Blockly.FieldImage.prototype.EDITABLE = !1,
Blockly.FieldImage.prototype.init = function() {
    this.fieldGroup_ || (this.fieldGroup_ = Blockly.utils.createSvgElement("g", {}, null),
    this.visible_ || (this.fieldGroup_.style.display = "none"),
    this.imageElement_ = Blockly.utils.createSvgElement("image", {
        height: this.height_ + "px",
        width: this.width_ + "px"
    }, this.fieldGroup_),
    this.setValue(this.src_),
    this.sourceBlock_.getSvgRoot().appendChild(this.fieldGroup_),
    this.setTooltip(this.sourceBlock_),
    Blockly.Tooltip.bindMouseEvents(this.imageElement_))
}
,
Blockly.FieldImage.prototype.dispose = function() {
    goog.dom.removeNode(this.fieldGroup_),
    this.imageElement_ = this.fieldGroup_ = null
}
,
Blockly.FieldImage.prototype.setTooltip = function(e) {
    this.imageElement_.tooltip = e
}
,
Blockly.FieldImage.prototype.getValue = function() {
    return this.src_
}
,
Blockly.FieldImage.prototype.setValue = function(e) {
    null !== e && (this.src_ = e,
    this.imageElement_ && this.imageElement_.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", e || ""))
}
,
Blockly.FieldImage.prototype.getFlipRTL = function() {
    return this.flipRTL_
}
,
Blockly.FieldImage.prototype.setText = function(e) {
    null !== e && (this.text_ = e)
}
,
Blockly.FieldImage.prototype.render_ = function() {}
,
Blockly.FieldImage.prototype.updateWidth = function() {}
,
Blockly.Field.register("field_image", Blockly.FieldImage),
Blockly.FieldNote = function(e, t) {
    e = e && !isNaN(e) ? String(e) : "0",
    Blockly.FieldNote.superClass_.constructor.call(this, e, t),
    this.addArgType("note"),
    this.fieldEditorHeight_ = this.fieldEditorWidth_ = 0,
    this.pianoSVG_ = null,
    this.keySVGs_ = [],
    this.displayedOctave_ = this.highCText_ = this.lowCText_ = this.noteNameText_ = null,
    this.animationTarget_ = this.animationPos_ = 0,
    this.mouseIsDown_ = !1,
    this.mouseDownWrappers_ = [],
    this.mouseUpWrapper_ = null,
    this.mouseEnterWrappers_ = [],
    this.octaveUpMouseDownWrapper_ = this.octaveDownMouseDownWrapper_ = null
}
,
