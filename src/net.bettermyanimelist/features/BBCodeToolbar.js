/* global UserInterface */

/* BBCode toolbar */

UserInterface.wrap([{
    $queryAll: ['textarea'],
    id: 'bbCodeWrapper',
    $children: [
    {
        id: 'bbCodeToolbarWrapper',
        $children: [
        {
            className: 'bbCodeToolbar',
            $children: [
            {
                $name: 'button',
                $_className: [
                'fa fa-eye button',
                'fa fa-sticky-note',
                'fa fa-bold button',
                'fa fa-italic button',
                'fa fa-underline button',
                'fa fa-strikethrough button',
                'fa fa-font button',
                'fa fa-text-height button',
                'fa fa-align-center button',
                'fa fa-align-right button',
                'fa fa-link button',
                'fa fa-picture-o button',
                'fa fa-list-ol button',
                'fa fa-list button',
                'fa fa-quote-left button',
                'fa fa-minus-square-o button',
                'fa fa-youtube button'
                ],
                $_title: [
                'Preview',
                'Message templates',
                'Bold',
                'Italic',
                'Underline',
                'Striketrough',
                'Color',
                'Size',
                'Center',
                'Right',
                'Link',
                'Picture',
                'Ordered list',
                'Unordered list',
                'Quote',
                'Spoiler',
                'Youtube'
                ],
                onclick: [
                'preview',
                'b',
                'i',
                'u',
                's',
                'color',
                'size',
                'center',
                'right',
                'url',
                'img',
                'list=1',
                'list',
                'quote',
                'spoiler',
                'youtube'
                ]
            }
            ]
        }]
    },
    {
        $here: true
    }
    ]
}], {persist: true});